/* Oral Clinic — comportamento do site (JavaScript simples, sem bibliotecas). */
(function () {
  'use strict';
  var cfg = window.ORAL_CONFIG || {};
  var digits = function (v) { return String(v || '').replace(/\D/g, ''); };
  // Número para ligar: acrescenta +55 só se o código do país ainda não estiver no número
  var telHref = function (v) { var d = digits(v); if (d.length > 11 && d.indexOf('55') === 0) d = d.slice(2); return 'tel:+55' + d; };

  /* 1. Preenche os dados da clínica a partir do config.js */
  document.querySelectorAll('[data-cfg]').forEach(function (el) {
    var v = cfg[el.getAttribute('data-cfg')];
    if (v) el.textContent = v;
    var kind = el.getAttribute('data-cfg-href');
    if (kind && v) {
      el.setAttribute('href', kind === 'tel' ? telHref(v) : 'mailto:' + v);
    }
  });
  var wa = digits(cfg.whatsapp);
  var hasTel = digits(cfg.telefone).length >= 10;
  var waUrl = wa ? 'https://wa.me/' + wa + '?text=' + encodeURIComponent('Olá! Gostaria de agendar uma consulta na Oral Clinic.') : '';
  var ig = String(cfg.instagram || '').trim();
  var igUrl = ig ? (/^https?:\/\//i.test(ig) ? ig : 'https://instagram.com/' + ig.replace(/^@/, '').replace(/\/$/, '')) : '';

  var nomeClinica = cfg.nome || 'Oral Clinic';

  // Botões "Agendar avaliação": abrem o WhatsApp direto; sem número, levam ao formulário
  var avalUrl = wa ? 'https://wa.me/' + wa + '?text=' + encodeURIComponent('Olá! Gostaria de agendar uma avaliação na ' + nomeClinica + '.') : '';
  document.querySelectorAll('[data-wa-agendar]').forEach(function (a) {
    if (avalUrl) { a.setAttribute('href', avalUrl); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
  });

  // Mapa: monta o Google Maps a partir do endereço do config.js
  var loc = document.getElementById('localizacao');
  if (loc) {
    if (!cfg.endereco) { loc.hidden = true; }
    else {
      var consulta = encodeURIComponent(nomeClinica + ' ' + cfg.endereco);
      document.getElementById('mapa').src = 'https://www.google.com/maps?q=' + consulta + '&output=embed';
      document.getElementById('loc-abrir').href = 'https://www.google.com/maps/search/?api=1&query=' + consulta;
      document.getElementById('loc-rota').href = 'https://www.google.com/maps/dir/?api=1&destination=' + consulta;
    }
  }

  // Campos opcionais sem dado: esconde a linha
  document.querySelectorAll('[data-hide-empty]').forEach(function (el) {
    if (!cfg[el.getAttribute('data-hide-empty')]) el.hidden = true;
  });
  // Link "Como chegar" (Google Maps) a partir do endereço
  var maps = document.getElementById('ft-maps');
  if (maps && cfg.endereco) {
    maps.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(nomeClinica + ' ' + cfg.endereco);
    maps.hidden = false;
  }
  // WhatsApp: com número configurado abre a conversa; sem número, os botões viram "Ligar" (se houver telefone)
  ['fab-wa', 'bar-wa', 'ft-wa'].forEach(function (id) {
    var a = document.getElementById(id);
    if (!a) return;
    if (waUrl) { a.setAttribute('href', waUrl); return; }
    if (hasTel) {
      a.setAttribute('href', telHref(cfg.telefone)); a.removeAttribute('target');
      if (id === 'ft-wa') a.parentNode.hidden = true;
      else if (a.lastChild && a.lastChild.nodeType === 3) a.lastChild.textContent = 'Ligar';
    } else a.removeAttribute('target');
  });
  // Instagram: só aparece quando o perfil estiver configurado
  ['fab-ig', 'bar-ig', 'ft-ig'].forEach(function (id) {
    var a = document.getElementById(id);
    if (!a) return;
    if (igUrl) a.setAttribute('href', igUrl);
    else if (id === 'ft-ig') a.parentNode.hidden = true;
    else a.hidden = true;
  });
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* 2. Menu no celular */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* Cabeçalho vira sólido ao rolar a página */
  var hdr = document.getElementById('hdr');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('solid', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* 3. Formulário de agendamento */
  var form = document.getElementById('form-agendamento');
  if (!form) return;
  var ok = document.getElementById('agendamento-ok');
  var f = {
    nome: document.getElementById('nome'), tel: document.getElementById('tel'),
    servico: document.getElementById('servico'), data: document.getElementById('data'),
    periodo: document.getElementById('periodo'), consent: document.getElementById('consent')
  };
  var hoje = new Date(); hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  var hojeIso = hoje.toISOString().slice(0, 10);
  f.data.min = hojeIso;

  // Os botões "Agendar" de cada serviço já escolhem o serviço no formulário
  document.querySelectorAll('[data-servico]').forEach(function (a) {
    a.addEventListener('click', function () { f.servico.value = a.getAttribute('data-servico'); });
  });

  function erro(campo, msg) {
    var span = document.getElementById('e-' + campo);
    span.textContent = msg || '';
    var input = f[campo];
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var grupo = input.closest('.fg');
    if (grupo) grupo.classList.toggle('bad', !!msg);
  }
  function dataBr(iso) { var p = iso.split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var er = {};
    if (f.nome.value.trim().length < 3) er.nome = 'Informe seu nome completo.';
    if (digits(f.tel.value).length < 10) er.tel = 'Informe um telefone com DDD.';
    if (!f.servico.value) er.servico = 'Selecione um serviço.';
    if (!f.data.value) er.data = 'Escolha uma data.';
    else if (f.data.value < hojeIso) er.data = 'Escolha uma data a partir de hoje.';
    if (!f.consent.checked) er.consent = 'É necessário autorizar o uso dos dados para agendar.';
    ['nome', 'tel', 'servico', 'data', 'consent'].forEach(function (c) { erro(c, er[c]); });
    var primeiro = Object.keys(er)[0];
    if (primeiro) { f[primeiro].focus(); return; }

    var nome = f.nome.value.trim();
    var v = { servico: f.servico.value, data: f.data.value, periodo: f.periodo.value, tel: f.tel.value.trim() };
    var submitBtn = form.querySelector('button[type="submit"]');
    var rotulo = submitBtn.textContent;
    submitBtn.disabled = true; submitBtn.textContent = 'Enviando…';

    // enviado = true: o pedido foi gravado no sistema da clínica.
    // enviado = false: o envio automático falhou; o paciente conclui pelo WhatsApp ou telefone.
    function mostrar(enviado) {
      var linhas = nome + ' · ' + v.servico + '\n' + dataBr(v.data) + ' · ' + v.periodo;
      document.getElementById('resumo').textContent = enviado
        ? 'Solicitação enviada!\n' + linhas + '\nA clínica vai entrar em contato pelo telefone informado para confirmar o horário. Só vale como agendamento após essa confirmação.'
        : 'Não foi possível enviar automaticamente.\n' + linhas + '\nConclua o pedido pelo WhatsApp ou por telefone.';
      var msg = 'Olá! Gostaria de solicitar um agendamento na Oral Clinic.\nNome: ' + nome +
        '\nTelefone: ' + v.tel + '\nServiço: ' + v.servico +
        '\nData preferida: ' + dataBr(v.data) + '\nPeríodo: ' + v.periodo;
      var btn = document.getElementById('btn-wa'), aviso = document.getElementById('aviso-wa'), call = document.getElementById('btn-call');
      btn.hidden = true; aviso.hidden = true; call.hidden = true;
      if (wa) {
        btn.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg);
        btn.textContent = enviado ? 'Falar agora pelo WhatsApp' : 'Enviar pelo WhatsApp';
        btn.hidden = false;
      } else if (hasTel) {
        call.href = telHref(cfg.telefone); call.textContent = 'Ligar para ' + cfg.telefone; call.hidden = false;
        if (!enviado) { aviso.textContent = 'Ligue para a clínica e informe os dados acima.'; aviso.hidden = false; }
      } else if (!enviado) { aviso.hidden = false; }
      submitBtn.disabled = false; submitBtn.textContent = rotulo;
      form.hidden = true; ok.hidden = false;
      ok.scrollIntoView({ block: 'nearest' });
    }

    // O pedido é enviado para a planilha da clínica (Google Planilhas), pelo endereço configurado em config.js (formUrl).
    var url = String(cfg.formUrl || '').trim();
    if (!url) { mostrar(false); return; }
    var corpo = new URLSearchParams();
    corpo.set('nome', nome); corpo.set('tel', v.tel); corpo.set('servico', v.servico);
    corpo.set('data', v.data); corpo.set('periodo', v.periodo); corpo.set('consent', 'sim');
    corpo.set('website', form.elements['website'] ? form.elements['website'].value : '');
    // no-cors: o navegador não deixa ler a resposta; só falha se não houver conexão.
    fetch(url, { method: 'POST', mode: 'no-cors', body: corpo })
      .then(function () { mostrar(true); form.reset(); f.data.min = hojeIso; })
      .catch(function () { mostrar(false); });
  });

  document.getElementById('novo').addEventListener('click', function () {
    ok.hidden = true; form.hidden = false; f.nome.focus();
  });
})();
