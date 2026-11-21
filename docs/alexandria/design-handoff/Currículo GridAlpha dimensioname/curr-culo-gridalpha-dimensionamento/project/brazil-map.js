// <brazil-map> — Brazil by ONS submarket, real geometry (world-atlas TopoJSON) + engraved atlas styling.
// Attributes: variant="full|mini|thumb", region="all|N|NE|SECO|S", labels="on|off", grid="on|off", lines="on|off"
(() => {
  const SRC = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';
  let brazilPromise = null;

  const COLORS = {
    N:    { fill: '#9AAE85', label: 'N' },
    NE:   { fill: '#DFC392', label: 'NE' },
    SECO: { fill: '#CB9271', label: 'SE/CO' },
    S:    { fill: '#9FB4C6', label: 'S' },
  };

  // Approximate submarket envelopes (lon/lat) — intersected with real coastline via clip paths.
  const ENVELOPES = {
    N: [[-75,7],[-50,7],[-44,-1.2],[-41.6,-4],[-45,-7],[-46,-13],[-50,-13],[-50,-10],[-58,-10],[-58,-8],[-61,-8],[-63,-9],[-66,-9.5],[-75,-9.5]],
    NE: [[-44,-1.2],[-33,-4],[-33,-12],[-36.5,-16.2],[-40,-18.4],[-43,-15],[-46,-13],[-45,-7],[-41.6,-4]],
    SECO: [[-62,-7.6],[-58,-8],[-58,-10],[-50,-10],[-50,-13],[-46,-13],[-43,-15],[-40,-18.4],[-36.5,-16.2],[-38.8,-21],[-44,-24],[-48.2,-25.4],[-53.5,-24.2],[-58.2,-22.4],[-58.2,-16],[-61.5,-13]],
    S: [[-58.2,-22.4],[-53.5,-24.2],[-48.2,-25.4],[-47.6,-29],[-50,-35],[-58,-31],[-58.4,-27]],
  };

  const CENTROIDS = { N: [-60.5,-3.4], NE: [-40.2,-8.2], SECO: [-49.5,-17.4], S: [-52.6,-28.6] };

  // A few real nodes of the SIN (lon/lat) — used as an interconnection schematic overlay.
  const NODES = [
    ['Belo Monte', -51.78, -3.13], ['Tucuruí', -49.64, -3.83], ['Teresina', -42.80, -5.09],
    ['Sobradinho', -40.82, -9.43], ['Fortaleza', -38.54, -3.73], ['Recife', -34.88, -8.05],
    ['Salvador', -38.50, -12.97], ['Brasília', -47.88, -15.79], ['Belo Horizonte', -43.94, -19.92],
    ['São Paulo', -46.63, -23.55], ['Rio de Janeiro', -43.20, -22.91], ['Itaipu', -54.59, -25.41],
    ['Porto Alegre', -51.23, -30.03], ['Cuiabá', -56.10, -15.60], ['Manaus', -60.02, -3.11],
    ['Porto Velho', -63.90, -8.76],
  ];
  const LINKS = [[14,15],[0,1],[1,2],[2,4],[4,5],[5,6],[6,3],[3,7],[1,7],[7,13],[13,11],[7,8],[8,9],[8,10],[9,10],[9,11],[11,12],[12,9],[0,7]];

  function waitForLibs() {
    return new Promise((res) => {
      const t = () => (window.d3 && window.topojson) ? res() : setTimeout(t, 40);
      t();
    });
  }

  async function getBrazil() {
    if (!brazilPromise) {
      brazilPromise = (async () => {
        await waitForLibs();
        const topo = await (await fetch(SRC)).json();
        const fc = window.topojson.feature(topo, topo.objects.countries);
        return fc.features.find((f) => f.properties && /Brazil|Brasil/i.test(f.properties.name || ''));
      })();
    }
    return brazilPromise;
  }

  class BrazilMap extends HTMLElement {
    connectedCallback() { this.render(); }
    static get observedAttributes() { return ['variant', 'region', 'labels', 'grid', 'lines']; }
    attributeChangedCallback() { if (this.isConnected) this.render(); }

    async render() {
      const variant = this.getAttribute('variant') || 'full';
      const region = this.getAttribute('region') || 'all';
      const showLabels = (this.getAttribute('labels') || (variant === 'full' ? 'on' : 'off')) === 'on';
      const showGrid = (this.getAttribute('grid') || (variant === 'full' ? 'on' : 'off')) === 'on';
      const showLines = (this.getAttribute('lines') || (variant === 'full' ? 'on' : 'off')) === 'on';
      const W = +(this.getAttribute('w') || (variant === 'full' ? 720 : variant === 'mini' ? 240 : 120));
      const H = +(this.getAttribute('h') || Math.round(W * 1.02));

      const brazil = await getBrazil();
      if (!brazil) return;
      const d3 = window.d3;
      const uid = 'bm' + Math.random().toString(36).slice(2, 8);

      const focus = region === 'all'
        ? brazil
        : { type: 'Feature', geometry: { type: 'Polygon', coordinates: [ENVELOPES[region].concat([ENVELOPES[region][0]])] } };
      const proj = d3.geoMercator().fitExtent([[W * 0.06, H * 0.05], [W * 0.94, H * 0.95]], focus);
      const path = d3.geoPath(proj);
      const brPath = path(brazil);

      const regions = region === 'all' ? Object.keys(ENVELOPES) : [region];
      const clips = regions.map((k) => {
        const poly = { type: 'Polygon', coordinates: [ENVELOPES[k].concat([ENVELOPES[k][0]])] };
        return `<clipPath id="${uid}-${k}"><path d="${path(poly)}"></path></clipPath>`;
      }).join('');
      const fills = regions.map((k) => `<path d="${brPath}" fill="${COLORS[k].fill}" fill-opacity="${variant === 'thumb' ? 0.95 : 0.8}" clip-path="url(#${uid}-${k})"></path>
        <path d="${path({ type: 'Polygon', coordinates: [ENVELOPES[k].concat([ENVELOPES[k][0]])] })}" fill="none" stroke="#7A6A50" stroke-width="0.6" stroke-dasharray="3 2" clip-path="url(#${uid}-all)"></path>`).join('');

      const grid = showGrid ? `<g stroke="#B5A585" stroke-width="0.4" opacity="0.55" fill="none">${
        d3.geoGraticule().step([5, 5]).lines().map((l) => `<path d="${path(l)}"></path>`).join('')
      }</g>` : '';

      let net = '';
      if (showLines) {
        const pts = NODES.map((n) => proj([n[1], n[2]]));
        net = `<g clip-path="url(#${uid}-all)">${LINKS.map(([a, b]) => {
          const p = pts[a], q = pts[b];
          if (!p || !q) return '';
          const mx = (p[0] + q[0]) / 2 + (q[1] - p[1]) * 0.08, my = (p[1] + q[1]) / 2 - (q[0] - p[0]) * 0.08;
          return `<path d="M${p[0]},${p[1]} Q${mx},${my} ${q[0]},${q[1]}" fill="none" stroke="#A8462A" stroke-width="${variant === 'full' ? 1 : 0.7}" opacity="0.75"></path>`;
        }).join('')}${pts.map((p) => p ? `<circle cx="${p[0]}" cy="${p[1]}" r="${variant === 'full' ? 2.4 : 1.4}" fill="#123055" stroke="#F2E9D6" stroke-width="0.6"></circle>` : '').join('')}</g>`;
      }

      const labels = showLabels ? regions.map((k) => {
        const p = proj(CENTROIDS[k]);
        const fs = variant === 'full' ? 20 : 11;
        return `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" font-family="Cinzel, serif" font-size="${fs}" fill="#3B3226" letter-spacing="${(fs * 0.12).toFixed(2)}">${COLORS[k].label.toUpperCase()}</text>`;
      }).join('') : '';

      this.style.display = this.style.display || 'block';
      this.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:100%;max-width:${W}px;max-height:${H}px" role="img" aria-label="Mapa do Brasil por submercado">
        <defs>${clips}<clipPath id="${uid}-all"><path d="${brPath}"></path></clipPath></defs>
        ${grid}
        <path d="${brPath}" fill="#EFE4CD"></path>
        ${fills}
        ${net}
        <path d="${brPath}" fill="none" stroke="#4A3F2E" stroke-width="${variant === 'thumb' ? 0.7 : 1.1}"></path>
        ${labels}
      </svg>`;
    }
  }
  if (!customElements.get('brazil-map')) customElements.define('brazil-map', BrazilMap);
})();
