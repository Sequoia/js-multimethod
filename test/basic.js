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

//goal: 
//      / add dispatcher
//      / attach a method
//      call and see it works

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