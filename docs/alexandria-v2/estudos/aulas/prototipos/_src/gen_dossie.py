"""Gera _src/dossie-m04-a07.html. Modelo do INST·07 do Módulo 04 (SEAS, RAMP, preços das camadas e limites de PLD do script do curso)."""
from pathlib import Path
AQUI = Path(__file__).resolve().parent
SEAS=[0.75,0.72,0.78,0.85,1.00,1.12,1.22,1.30,1.32,1.20,1.00,0.82]
RAMP=[0,0,0,0,0,0,0.30,0.55,0.80,1.00,0.70,0.35]
MES=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
def expo(resid, S=100):
    return [resid/100*min(1611.04,max(57.31,200*SEAS[i]*(1+S/100*RAMP[i])))*10000 for i in range(12)]
E = expo(10)
x0,x1,y0,y1 = 70,600,20,250
vmax = 800_000
Y=lambda v: y1-(v/vmax)*(y1-y0)
bw=(x1-x0)/12
o=[]
for v in (0,200_000,400_000,600_000,800_000):
    o.append(f'<line x1="{x0}" y1="{Y(v):.1f}" x2="{x1}" y2="{Y(v):.1f}" stroke="#E4D8BE"/><text x="{x0-8}" y="{Y(v)+4:.1f}" text-anchor="end" font-size="12" fill="#5C5346">{v//1000} mil</text>')
for i,m in enumerate(MES):
    cx=x0+bw*(i+.5)
    o.append(f'<text x="{cx:.1f}" y="{y1+18}" text-anchor="middle" font-size="12" fill="#5C5346">{m}</text>')
    h=y1-Y(E[i])
    cls = ' class="so-reg"' if i>=6 else ''
    o.append(f'<rect{cls} x="{cx-bw*.3:.1f}" y="{Y(E[i]):.1f}" width="{bw*.6:.1f}" height="{h:.1f}" fill="#0D2340"/>')
    if i<6:
        pass
# 2º semestre velado no estado inicial (choque ainda não aplicado ao desenho)
o.append(f'<g class="so-ini"><rect x="{x0+bw*6+2:.1f}" y="{y0}" width="{bw*6-4:.1f}" height="{y1-y0}" fill="#FBF6EA" stroke="#CFC1A4" stroke-dasharray="4 3"/>'
         f'<text x="{x0+bw*9:.1f}" y="{Y(430_000):.1f}" text-anchor="middle" font-size="13" font-style="italic" fill="#5C5346">2º semestre com choque:</text>'
         f'<text x="{x0+bw*9:.1f}" y="{Y(430_000)+17:.1f}" text-anchor="middle" font-size="13" font-style="italic" fill="#5C5346">aparece depois da sua previsão</text></g>')
o.append(f'<line x1="{x0}" y1="{Y(500_000):.1f}" x2="{x1}" y2="{Y(500_000):.1f}" stroke="#2A2620" stroke-width="1.8" stroke-dasharray="8 5"/>'
         f'<text x="{x0+4}" y="{Y(500_000)-7:.1f}" font-size="13" font-weight="600" fill="#2A2620">limite da política · R$ 500 mil</text>')
o.append(f'<g class="so-reg"><text x="{x0+bw*9.5:.1f}" y="{Y(590_000):.1f}" text-anchor="middle" font-size="13" font-weight="600" fill="#0D2340">Out · R$ 480 mil</text></g>')
o.append(f'<line x1="{x0}" y1="{y1}" x2="{x1}" y2="{y1}" stroke="#2A2620"/>')
src=(AQUI/"dossie-m04-a07.tpl").read_text(encoding="utf-8").replace("@@EXPO@@","".join(o))
(AQUI/"dossie-m04-a07.html").write_text(src,encoding="utf-8")
print("ok",[round(e) for e in E])
