jubatus-tutorial-node
=====================

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3f911234639f46f28ff414bbd513dfdb)](https://www.codacy.com/app/n.kimura.cap/jubatus-tutorial-node?utm_source=github.com&utm_medium=referral&utm_content=naokikimura/jubatus-tutorial-node&utm_campaign=badger)

See [Jubatus Basic Tutorial](http://jubat.us/en/tutorial/tutorial.html)

Quick Start
--------------------

```bash
git clone https://github.com/naokikimura/jubatus-tutorial-node.git
cd jubatus-tutorial-node

# install Node.js (Mac OS X)
# brew install node
npm install

curl -O http://people.csail.mit.edu/jrennie/20Newsgroups/20news-bydate.tar.gz
tar -xvzf 20news-bydate.tar.gz

# install Jubatus (Mac OS X)
# brew tap jubatus/jubatus
# brew install jubatus --use-clang
jubaclassifier -D -f config.json

node tutorial.js
```

## Requires ##

- [Jubatus](http://jubat.us/en/)
- [Node.js](https://nodejs.or]) v6+

## See alse ##

- https://github.com/naokikimura/jubatus-node-client