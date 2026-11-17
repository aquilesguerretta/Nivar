"""Gera _src/serie-m02-a04.html. Curvas do INST·04 do Módulo 02 (perfil f[h] e solar sen^1,5 do script do curso)."""
import math
from pathlib import Path

F = [0.72,0.70,0.68,0.67,0.67,0.68,0.72,0.78,0.84,0.88,0.90,0.91,0.90,0.89,0.88,0.88,0.90,0.95,1.00,0.99,0.95,0.90,0.83,0.77,0.72]
def modelo(pico=95, S=30, c=1.0):
    L=[pico*F[h] for h in range(25)]
    N=[L[h]-((S*c*max(0,math.sin(math.pi*(h-6)/12))**1.5) if 6<=h<=18 else 0) for h in range(25)]
    return L,N
L,N = modelo()
PREV = {0:68,4:64,8:72,12:73,16:80,20:92,24:68}   # traço registrado de exemplo (erro típico: vale de madrugada)

def plano(W,H,x0,x1,y0,y1,vmin,vmax,fs):
    X=lambda h: x0+h/24*(x1-x0)
    Y=lambda v: y0+(vmax-v)/(vmax-vmin)*(y1-y0)
    return X,Y

def figura(W,H,x0,x1,y0,y1,fs,compacta=False):
    vmin,vmax=40,100
    X,Y=plano(W,H,x0,x1,y0,y1,vmin,vmax,fs)
    o=[]
    for v in (40,60,80,100):
        o.append(f'<line x1="{x0}" y1="{Y(v):.1f}" x2="{x1}" y2="{Y(v):.1f}" stroke="#E4D8BE"/>'
                 f'<text x="{x0-8}" y="{Y(v)+fs*0.35:.1f}" text-anchor="end" font-size="{fs}" fill="#5C5346">{v}</text>')
    for h in (0,6,12,18,24):
        o.append(f'<text x="{X(h):.1f}" y="{y1+fs+8}" text-anchor="middle" font-size="{fs}" fill="#5C5346">{h} h</text>')
    o.append(f'<line x1="{x0}" y1="{y1}" x2="{x1}" y2="{y1}" stroke="#2A2620"/>')
    tot=" ".join(f"{X(h):.1f},{Y(L[h]):.1f}" for h in range(25))
    net=" ".join(f"{X(h):.1f},{Y(N[h]):.1f}" for h in range(25))
    pv=" ".join(f"{X(h):.1f},{Y(v):.1f}" for h,v in PREV.items())
    if not compacta:
        # faixas nomeadas do dia
        for a,b,t in ((0,6,"madrugada"),(10,14,"sol a pino"),(16,21,"pôr do sol e início da noite")):
            o.append(f'<rect x="{X(a):.1f}" y="{y0}" width="{X(b)-X(a):.1f}" height="{y1-y0}" fill="#F2E9D6"/>'
                     f'<text x="{(X(a)+X(b))/2:.1f}" y="{y0+fs+4}" text-anchor="middle" font-size="{fs}" fill="#6B6255" font-style="italic">{t}</text>')
        o.insert(0,'')
    o.append(f'<polyline points="{tot}" fill="none" stroke="#6B6255" stroke-width="{2 if not compacta else 1.6}"/>')
    o.append(f'<text x="{X(24)+6:.1f}" y="{Y(L[24])-6:.1f}" font-size="{fs}" fill="#5C5346">carga total</text>' if not compacta else
             f'<text x="{X(18)+4:.1f}" y="{Y(L[18])-6:.1f}" font-size="{fs}" fill="#5C5346">carga total</text>')
    if compacta:
        # alças do traço (estado inicial: sobre a carga total)
        for h in PREV:
            o.append(f'<g class="so-ini"><circle cx="{X(h):.1f}" cy="{Y(L[h]):.1f}" r="7" fill="#FBF6EA" stroke="#0D2340" stroke-width="1.6"/></g>')
        ini=" ".join(f"{X(h):.1f},{Y(L[h]):.1f}" for h in PREV)
        o.append(f'<polyline class="so-ini" points="{ini}" fill="none" stroke="#0D2340" stroke-width="1.6" stroke-dasharray="6 4"/>')
        o.append(f'<g class="so-reg"><polyline points="{pv}" fill="none" stroke="#0D2340" stroke-width="2" stroke-dasharray="6 4"/>'
                 + "".join(f'<circle cx="{X(h):.1f}" cy="{Y(v):.1f}" r="5" fill="#0D2340"/>' for h,v in PREV.items()) + '</g>')
        return "".join(o)
    # estado inicial: só a carga total + convite
    o.append(f'<g class="so-ini"><rect x="{X(7.5):.1f}" y="{Y(58):.1f}" width="{X(15.5)-X(7.5):.1f}" height="54" fill="#FBF6EA" stroke="#CFC1A4"/>'
             f'<text x="{X(11.5):.1f}" y="{Y(58)+22:.1f}" text-anchor="middle" font-size="{fs}" font-style="italic" fill="#5C5346">A carga líquida calculada aparece</text>'
             f'<text x="{X(11.5):.1f}" y="{Y(58)+40:.1f}" text-anchor="middle" font-size="{fs}" font-style="italic" fill="#5C5346">sobre o seu traço, depois do registro.</text></g>')
    # registrado: traço + calculada + anotações
    r=[f'<polyline points="{pv}" fill="none" stroke="#2A2620" stroke-width="2" stroke-dasharray="7 5"/>']
    r+= [f'<circle cx="{X(h):.1f}" cy="{Y(v):.1f}" r="4" fill="#F2E9D6" stroke="#2A2620" stroke-width="1.5"/>' for h,v in PREV.items()]
    r.append(f'<text x="{X(4)-4:.1f}" y="{Y(64)+22:.1f}" font-size="{fs}" fill="#2A2620">sua previsão</text>')
    r.append(f'<polyline points="{net}" fill="none" stroke="#0D2340" stroke-width="3.2"/>')
    r.append(f'<circle cx="{X(12):.1f}" cy="{Y(N[12]):.1f}" r="5.5" fill="#0D2340"/>')
    r.append(f'<text x="{X(11.6):.1f}" y="{Y(49):.1f}" text-anchor="end" font-size="{fs}" font-weight="600" fill="#0D2340">carga líquida calculada</text><text x="{X(11.6):.1f}" y="{Y(49)+fs+4:.1f}" text-anchor="end" font-size="{fs}" fill="#0D2340">mínimo 56 GW às 12 h</text>')
    # maior distância (12 h)
    r.append(f'<line x1="{X(12)+14:.1f}" y1="{Y(73):.1f}" x2="{X(12)+14:.1f}" y2="{Y(N[12]):.1f}" stroke="#2A2620" stroke-width="1.2"/>'
             f'<line x1="{X(12)+9:.1f}" y1="{Y(73):.1f}" x2="{X(12)+19:.1f}" y2="{Y(73):.1f}" stroke="#2A2620"/>'
             f'<line x1="{X(12)+9:.1f}" y1="{Y(N[12]):.1f}" x2="{X(12)+19:.1f}" y2="{Y(N[12]):.1f}" stroke="#2A2620"/>'
             f'<text x="{X(12)+26:.1f}" y="{Y(49):.1f}" font-size="{fs}" fill="#2A2620">maior distância entre traço e calculada:</text>'
             f'<text x="{X(12)+26:.1f}" y="{Y(49)+fs+4:.1f}" font-size="{fs}" font-weight="600" fill="#2A2620">17,5 GW às 12 h</text>')
    # rampa máxima 16→17
    r.append(f'<line x1="{X(16):.1f}" y1="{Y(N[16]):.1f}" x2="{X(17):.1f}" y2="{Y(N[17]):.1f}" stroke="#A8462A" stroke-width="6"/>'
             f'<text x="{X(17)+14:.1f}" y="{Y(73):.1f}" font-size="{fs}" font-weight="600" fill="#A8462A">rampa máxima</text>'
             f'<text x="{X(17)+14:.1f}" y="{Y(73)+fs+4:.1f}" font-size="{fs}" font-weight="600" fill="#A8462A">+11,4 GW/h</text>'
             f'<text x="{X(17)+14:.1f}" y="{Y(73)+2*fs+8:.1f}" font-size="{fs}" fill="#A8462A">16 → 17 h</text>')
    o.append('<g class="so-reg">'+"".join(r)+'</g>')
    return "".join(o)

GRANDE = figura(1100,380,56,1000,22,330,13)
PEQ = figura(440,230,34,420,14,196,11.5,compacta=True)
# versão retrato para 390: tempo no eixo vertical
def retrato():
    x0,x1,y0,y1,fs=44,326,34,574,12
    X=lambda v: x0+(v-40)/60*(x1-x0)
    Y=lambda h: y0+h/24*(y1-y0)
    o=[]
    for v in (40,60,80,100):
        o.append(f'<line x1="{X(v):.1f}" y1="{y0}" x2="{X(v):.1f}" y2="{y1}" stroke="#E4D8BE"/><text x="{X(v):.1f}" y="{y0-10}" text-anchor="middle" font-size="{fs}" fill="#5C5346">{v}</text>')
    o.append(f'<text x="{x1}" y="{y0-24}" text-anchor="end" font-size="{fs}" fill="#5C5346">GW</text>')
    for h in (0,6,12,18,24):
        o.append(f'<text x="{x0-8}" y="{Y(h)+4:.1f}" text-anchor="end" font-size="{fs}" fill="#5C5346">{h} h</text>')
    o.append(f'<line x1="{x0}" y1="{y0}" x2="{x0}" y2="{y1}" stroke="#2A2620"/>')
    pt=lambda pts:" ".join(f"{X(v):.1f},{Y(h):.1f}" for h,v in pts)
    o.append(f'<polyline points="{pt(enumerate(L))}" fill="none" stroke="#6B6255" stroke-width="2"/>')
    o.append(f'<text x="{X(L[19])-6:.1f}" y="{Y(19)+18:.1f}" text-anchor="end" font-size="{fs}" fill="#5C5346">carga total</text>')
    o.append('<g class="so-reg">'
      f'<polyline points="{pt(PREV.items())}" fill="none" stroke="#2A2620" stroke-width="2" stroke-dasharray="7 5"/>'
      f'<polyline points="{pt(enumerate(N))}" fill="none" stroke="#0D2340" stroke-width="3.2"/>'
      f'<circle cx="{X(N[12]):.1f}" cy="{Y(12):.1f}" r="5" fill="#0D2340"/>'
      f'<text x="{X(N[12])+10:.1f}" y="{Y(12)+4:.1f}" font-size="{fs}" font-weight="600" fill="#0D2340">mínimo 56 GW · 12 h</text>'
      f'<text x="{X(N[12])+10:.1f}" y="{Y(12)+20:.1f}" font-size="{fs}" fill="#2A2620">sua previsão: 73 GW</text>'
      f'<line x1="{X(N[16]):.1f}" y1="{Y(16):.1f}" x2="{X(N[17]):.1f}" y2="{Y(17):.1f}" stroke="#A8462A" stroke-width="6"/>'
      f'<text x="{X(N[16])-8:.1f}" y="{Y(16.6):.1f}" text-anchor="end" font-size="{fs}" font-weight="600" fill="#A8462A">+11,4 GW/h</text>'
      f'<text x="{X(N[16])-8:.1f}" y="{Y(16.6)+15:.1f}" text-anchor="end" font-size="{fs}" fill="#A8462A">16 → 17 h</text>'
      f'<text x="{X(PREV[4])+8:.1f}" y="{Y(4)+4:.1f}" font-size="{fs}" fill="#2A2620">sua previsão</text>'
      '</g>')
    o.append(f'<g class="so-ini"><text x="54" y="{Y(12):.1f}" font-size="12.5" font-style="italic" fill="#5C5346">A carga líquida calculada</text><text x="54" y="{Y(12)+17:.1f}" font-size="12.5" font-style="italic" fill="#5C5346">aparece depois do registro.</text></g>')
    return "".join(o)
MOBV = retrato()

src = Path(__file__).with_name("serie-m02-a04.tpl").read_text(encoding="utf-8")
src = src.replace("@@GRANDE@@",GRANDE).replace("@@PEQ@@",PEQ).replace("@@MOB@@",MOBV)
Path(__file__).with_name("serie-m02-a04.html").write_text(src,encoding="utf-8")
print("ok", round(N[12],2), round(max(N[h+1]-N[h] for h in range(24)),2), max(abs(PREV[h]-N[h]) for h in PREV))
