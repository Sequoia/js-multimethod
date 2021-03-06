const tap = require('tap');
const { multi } = require('..');
const blank = multi(); //@todo I don't like this

tap.type(multi, Function, 'multi is a function');
tap.type(multi(), Function, 'multi returns a function');

tap.ok(multi().methods);
tap.type(multi().methods, Function);
tap.type(multi().methods(), Map);

tap.ok(multi().attach);
tap.type(multi().attach, Function);
tap.equal(blank.attach(), blank, 'attach allows chaining');

tap.test('attaching methods', function(t){
  const mm = multi(firstLetter);
  const aMethod = (msg) => ({ first: 'A', msg });
  const bMethod = (msg) => ({ first: 'B', msg });

  mm.attach('a', aMethod);
  t.equal(mm.methods().size,1);
  t.equal(mm.methods().get('a'), aMethod);

  mm.attach('b', bMethod);
  t.equal(mm.methods().size,2);
  t.equal(mm.methods().get('b'), bMethod);
  
  t.end();
});

tap.test('getMethod', function(t){
  const mm = multi(firstLetter);
  const aMethod = (msg) => ({ first: 'A', msg });
  const bMethod = (msg) => ({ first: 'B', msg });
  mm.attach('a', aMethod);
  mm.attach('b', bMethod);

  t.equal(mm.getMethod('a'), aMethod);
  t.equal(mm.getMethod('b'), bMethod);
  
  t.end();
});

tap.type(multi(function(){}).dispatcher, Function, 'mm exposes dispatcher');

tap.test('calling multimethod', function(t){
  const mm = firstLetterMulti();
  const [abc, bar] = [mm('abc'), mm('bar')];

  //route to expected function
  t.match(abc, {first:'A'});
  t.match(bar, {first:'B'});
  
  //passes on arguments
  t.equal(abc.msg, 'abc');
  
  //passes on many arguments
  mm.attach('z', (...chars) => chars.join(''));
  const zerg = mm('z','e','r','g');
  t.equal(zerg, 'zerg');
  
  t.end();
});

tap.test('detach', function(t){
  const mm = firstLetterMulti();
  //impl attached
  t.match(mm('abc'), {first:'A'});
  mm.detach('a');
  //impl NOT attached
  t.throws(mm.bind({},'abc'));
  t.end();
});

tap.test('catchall', function(t){
  const mm = firstLetterMulti();
  t.throws(mm.bind({}, 'xyz'));
  mm.catchall((msg)=> ({first: '??', msg}));
  t.match(mm('xyz'), {first:'??', msg:'xyz'});
  
  //passing null unsets catchall
  mm.catchall(null);
  t.throws(mm.bind({}, 'xyz'));
  t.end();
});

tap.test('derive', function(t){
  const mm = firstLetterMulti();
  t.type(mm.derive, 'function');

  mm.derive('x','a');
  t.match(mm('xyz'),{first:'A', msg:'xyz'},
    'single-level derive (x->a)');

  // y from x from a
  mm.derive('y', 'x');
  // z from y from x from a
  mm.derive('z', 'y');
  t.match(mm('zoot!'),{first:'A', msg:'zoot!'},
    'multi-level derive (z->y->x->a)');

  mm.attach('x', () => 'new method for dispatch X!');
  t.match(mm('xxx'), 'new method for dispatch X!',
    'new method attached to hierarchy matches self');
  t.match(mm('zoot!'), 'new method for dispatch X!',
    'new method attached to hierarchy matches derived (z->y->x)');

  mm.detach('a').detach('x')
    .catchall( () => '~~pass~~' );

  t.match(mm('zoot!'), '~~pass~~',
    'after detaching methods, hits default');

  t.end();
});

tap.test('handles', function(t){
  const mm = firstLetterMulti();

  t.notOk(mm.handles('x'));
  t.ok(mm.handles('a'));
  
  mm.catchall( () => 'pass!' );
  t.notOk(mm.handles('x'), 'not affected by catchall/default');

  t.end();
});

/**
 * returns a simple multimethod with a couple impls
 */
function firstLetterMulti(){
  return multi(firstLetter)
    .attach('a', (msg) => ({ first: 'A', msg }))
    .attach('b', (msg) => ({ first: 'B', msg }));
}
/**
 * gets first letter
 * @param {String} msg
 * @return {String} first letter of msg
 */
function firstLetter(msg){
  return msg[0];
}
