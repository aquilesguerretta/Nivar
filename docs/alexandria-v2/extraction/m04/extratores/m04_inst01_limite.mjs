// Espaço inteiro do INST 01 (D 53 × R 21 × H 21 × G 49), só a lógica literal das linhas 1404-1425.
const PLD_MIN=57.31, PLD_MAX_H=1611.04, PLD_MAX_E=785.27;
const seen={}; let n=0;
for(let D=300;D<=1600;D+=25)for(let Rr=0;Rr<=100;Rr+=5)for(let Hh=0;Hh<=100;Hh+=5)for(let G=120;G<=600;G+=10){
  const R=Rr/100; const agua=30+(100-Hh)/100*320;
  const fleet=[{n:'Solar',cap:200*R,cvu:0},{n:'Eólica',cap:300*R,cvu:12},{n:'Hidráulica',cap:350,cvu:agua},{n:'Gás',cap:400,cvu:G},{n:'Óleo',cap:250,cvu:900}];
  fleet.sort((a,b)=>a.cvu-b.cvu);
  let rest=D,marg=null,price=0;
  for(const f of fleet){const use=Math.min(f.cap,rest);rest-=use;if(use>0.001){marg=f;price=f.cvu;}}
  const def=Math.max(0,rest); if(def>0.001){price=PLD_MAX_H;marg={n:'déficit'};}
  let lim='nenhum';
  if(price<PLD_MIN){price=PLD_MIN;lim='piso R$ 57,31';}
  else if(price>PLD_MAX_H){price=PLD_MAX_H;lim='teto horário';}
  else if(price>PLD_MAX_E){lim='acima do teto estrutural';}
  const k=lim+' | marg='+marg.n; seen[k]=(seen[k]||0)+1; n++;
}
console.log(n, seen);
