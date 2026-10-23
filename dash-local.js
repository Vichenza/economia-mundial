// Small stand-in for the dashboard runtime, so the page works as a plain static site.
// It loads the JSON files in /dados, runs the page's calculations, and keeps the filters in the URL.
(() => {
  const ARQUIVOS = {
    historico: 'dados/historico_fmi.json',
    paises: 'dados/paises.json',
    agregados: 'dados/agregados_fmi.json',
    contornos: 'dados/contornos_paises.json',
    fmi: 'dados/projecoes_fmi_out2026.json',
    indicadores: 'dados/indicadores_g20.json',
  };
  const PADRAO = {
    indicador: 'pib_real', pais: '', continente: 'todos', sub_regiao: 'todas', grupo: 'todos',
    ano: 2026, paises: '', x: 'inflacao', y: 'desemprego', modo_corr: 'paises', visao: 'mapa',
  };
  const estado = {};
  const calcs = {};
  const cacheCalc = {};
  const assinantes = [];

  const lerURL = () => {
    const q = new URLSearchParams(location.search);
    const p = { ...PADRAO };
    Object.keys(PADRAO).forEach((k) => {
      if (q.has(k)) p[k] = typeof PADRAO[k] === 'number' ? Number(q.get(k)) : q.get(k);
    });
    return p;
  };
  let params = lerURL();
  const gravaURL = () => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== PADRAO[k]) q.set(k, v); });
    const s = q.toString();
    history.replaceState(null, '', `${location.pathname}${s ? `?${s}` : ''}${location.hash}`);
  };

  let agendado = false;
  const avisa = () => {
    if (agendado) return;
    agendado = true;
    setTimeout(() => {
      agendado = false;
      assinantes.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
    }, 0);
  };

  const data = (id) => {
    if (ARQUIVOS[id]) return estado[id] || { status: 'loading', data: null };
    const c = calcs[id];
    if (!c) return { status: 'error', data: null, error: `fonte desconhecida: ${id}` };
    const entradas = c.inputs.map(data);
    if (entradas.some((s) => s.status === 'error')) return { status: 'error', data: null };
    if (entradas.some((s) => s.status !== 'ok')) return { status: 'loading', data: null };
    if (!cacheCalc[id]) {
      try { cacheCalc[id] = { status: 'ok', data: c.fn(...entradas.map((s) => s.data)) }; }
      catch (e) { console.error(e); cacheCalc[id] = { status: 'error', data: null, error: String(e) }; }
    }
    return cacheCalc[id];
  };

  window.dash = {
    data,
    calc: (id, def) => { calcs[id] = def; },
    onData: (fn) => { assinantes.push(fn); avisa(); },
    params: () => params,
    setParams: (p) => { params = { ...params, ...p }; gravaURL(); avisa(); },
    setLink: (id) => { history.replaceState(null, '', `${location.pathname}${location.search}#${id}`); },
    // Category colours: África, América do Norte e Central, América do Sul, Ásia, Europa, Oceania, then extras
    colors: ['#3987e5', '#cf4f2a', '#22ad6e', '#c28708', '#cc3f84', '#0e9a0a', '#8a6ad8', '#4ba3b0'],
  };

  Object.entries(ARQUIVOS).forEach(([id, url]) => {
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`${r.status} ${url}`); return r.json(); })
      .then((d) => { estado[id] = { status: 'ok', data: d }; avisa(); })
      .catch((e) => { console.error(e); estado[id] = { status: 'error', data: null, error: String(e) }; avisa(); });
  });
})();
