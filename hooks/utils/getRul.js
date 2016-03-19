var Getter = require('y-setter').Getter,
    Rul = require('rul');

function getRul(rul,detacher){
  if(Rul.is(rul)) return rul;
  if(Getter.is(rul)) return fromGetter(rul,detacher);
  return fromRaw(rul);
}

function fromGetter(getter,detacher){
  var rul = new Rul(true),
      ctx = {};

  detacher.add(
    getter.watch(watcher,rul,ctx,detacher)
  );

  return rul;
}

function fromRaw(raw){
  var rul = new Rul(true);
  raw = raw || [];
  rul.append(raw);
  return rul;
}

function watcher(v,ov,d,rul,ctx,detacher){
  var r = getRul(v);

  if(ctx.detacher){
    ctx.detacher.detach();
    delete ctx.detacher;
  }

  rul.clear();
  ctx.detacher = r.consume(rul.add,rul.remove,rul.move,rul);
  detacher.add(ctx.detacher);
}

/*/ exports /*/

module.exports = getRul;
