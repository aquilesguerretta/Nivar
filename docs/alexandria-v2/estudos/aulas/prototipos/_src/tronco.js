(function () {
  var b = document.body;
  // Estado do comp: ?estado=registrado mostra o quadro "registrado → comparação".
  if (/estado=registrado/.test(location.search) || location.hash === '#registrado') b.classList.add('st-reg');
  // Gaveta do sumário: começa fechada, fecha com Esc.
  var gav = document.getElementById('gaveta');
  var gat = document.querySelector('[data-gaveta]');
  function fechar() { gav.classList.remove('aberta'); gat.setAttribute('aria-expanded', 'false'); }
  gat.addEventListener('click', function () {
    var ab = gav.classList.toggle('aberta');
    gat.setAttribute('aria-expanded', ab ? 'true' : 'false');
  });
  document.querySelector('[data-gaveta-fechar]').addEventListener('click', fechar);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
  // Opções: rádio por grupo, caixa de marcar quando .chk.
  document.querySelectorAll('.op').forEach(function (op) {
    op.setAttribute('type', 'button');
    op.addEventListener('click', function () {
      if (op.classList.contains('chk')) { op.classList.toggle('sel'); return; }
      var g = op.closest('[data-grupo]') || op.parentNode;
      g.querySelectorAll('.op').forEach(function (o) { o.classList.remove('sel'); o.setAttribute('aria-pressed', 'false'); });
      op.classList.add('sel'); op.setAttribute('aria-pressed', 'true');
    });
  });
  // Registrar: no comp, qualquer registro leva a aula ao quadro "registrado → comparação".
  document.querySelectorAll('[data-registrar]').forEach(function (bt) {
    bt.addEventListener('click', function () { b.classList.add('st-reg'); });
  });
  // Passos numéricos (−/+) com o passo declarado no campo.
  document.querySelectorAll('.num-step').forEach(function (ns) {
    var inp = ns.querySelector('input');
    var bts = ns.querySelectorAll('button');
    function mudar(s) {
      var v = parseFloat(String(inp.value).replace(/\./g, '').replace(',', '.')) || 0;
      v = Math.max(parseFloat(inp.dataset.min || 0), v + s * parseFloat(inp.dataset.passo || 1));
      inp.value = v.toLocaleString('pt-BR');
    }
    bts[0].addEventListener('click', function () { mudar(-1); });
    bts[1].addEventListener('click', function () { mudar(1); });
  });
})();
