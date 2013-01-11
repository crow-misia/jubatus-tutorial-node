#!/usr/bin/env node

var rpc = require('./msgpack-rpc')
  , fs = require('fs')
  , util = require('util')
  , lazy = require('lazy')
  , async = require('async')
  , argv = require('argv')

var debug;
if (process.env.NODE_DEBUG && /tutorial/.test(process.env.NODE_DEBUG)) {
  debug = function(x) { console.error('TUTORIAL:', x); };
} else {
  debug = function() { };
}

function get_most_likely(estimate_results) {
    return estimate_results.reduce(function(previous, current) {
        return previous[1] > current[1] ? previous : current;
    })
}

var options = [
        { name: 'server_ip', short: 's', type: 'string', description: 'server_ip' }
      , { name: 'server_port', short: 'p', type: 'int', description: 'server_port' }
      , { name: 'name', short: 'n', type: 'string', description: 'name' }
    ]
  , args = argv.option([options]).run();

debug(args)

var host = args.options.server_ip
  , port = args.options.server_port
  , name = args.options.name || 'tutorial'

var client = rpc.createClient(port, host)

async.series([
    function(callback) {
        client.call('get_config', [name], callback);
    }
  , function(callback) {
        client.call('get_status', [name], callback)
    }
  , function(callback) {
        var is = fs.createReadStream('train.dat').on('open', function() {
            debug('train start')
        }).on('end', function() {
            debug('train end')
            callback(null)
        })
        lazy(is).lines.map(function(line) {
            var row = line.toString().split(/,/)
              , label = row[0]
              , file = row[1]
              , message = fs.readFileSync(file).toString()
              , datum = [[ ["message", message ] ], []]
            return [ [label, datum] ]
        }).forEach(function(data) {
            client.call('train', [name, data]);
            client.call('get_status', [name])
        })
    }
  , function(callback) {
        client.call('save', [name, 'tutorial'], callback)
    }
  , function(callback) {
        client.call('load', [name, 'tutorial'], callback)
    }
  , function(callback) {
        client.call('get_status', [name], callback)
    }
  , function(callback) {
        var is = fs.createReadStream('test.dat').on('open', function() {
            debug('classify start')
        }).on('end', function() {
            debug('classify end')
            callback(null)
        })
        lazy(is).lines.map(function(line) {
            var row = line.toString().split(/,/)
              , label = row[0]
              , file = row[1]
              , message = fs.readFileSync(file).toString()
              , datum = [[ ["message", message ] ], []]
            return { label: label, datum: datum }
        }).forEach(function(o) {
            var label = o.label
              , data = [ o.datum ]
            client.call('classify', [name, data], function(error, resultset) {
                resultset.forEach(function(estimate_results) {
                    var estimate_result = get_most_likely(estimate_results)
                      , result = estimate_result[0] === label ? 'OK' : 'NG'
                    console.info('%s,%s,%s,%d', result, label, estimate_result[0], estimate_result[1]);
                })
            });
        })
    }
], function(error) {
    client.close();
})
