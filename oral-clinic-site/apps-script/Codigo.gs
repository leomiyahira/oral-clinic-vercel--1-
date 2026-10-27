/**
 * Recebe os pedidos de agendamento do site e grava na planilha.
 * Cole este código em: Planilha > Extensões > Apps Script. Passo a passo no LEIA-ME.md.
 */

// ===== CONFIGURE AQUI =====
var NOME_CLINICA = 'Oral Clinic';
var EMAIL_AVISO = '';            // e-mail que recebe aviso a cada pedido (opcional). Ex.: 'contato@clinica.com.br'
var NOME_DA_ABA = 'Agendamentos';
// ==========================

var SERVICOS = ['Clínica Geral', 'Ortodontia', 'Implantes Dentários', 'Clareamento Dental', 'Odontopediatria', 'Odontologia Estética', 'Urgência Odontológica'];
var PERIODOS = ['Manhã', 'Tarde', 'Noite'];
var DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

function doGet() {
  return resposta('ok');
}

function doPost(e) {
  var p = (e && e.parameter) ? e.parameter : {};

  // Campo-armadilha: pessoas não preenchem, robôs sim.
  if (p.website) { return resposta('ok'); }

  var nome = String(p.nome || '').replace(/\s+/g, ' ').trim();
  var tel = String(p.tel || '').replace(/\D/g, '');
  var servico = String(p.servico || '');
  var data = String(p.data || '');
  var periodo = String(p.periodo || '');

  var valido = nome.length >= 3 && nome.length <= 100 &&
    tel.length >= 10 && tel.length <= 13 &&
    SERVICOS.indexOf(servico) >= 0 && PERIODOS.indexOf(periodo) >= 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(data) && p.consent === 'sim';
  if (!valido) { return resposta('erro'); }

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    // Evita pedido duplicado (duplo clique) do mesmo telefone e data em poucos minutos
    var cache = CacheService.getScriptCache();
    var chave = 'p' + tel + data;
    if (cache.get(chave)) { return resposta('ok'); }
    cache.put(chave, '1', 300);

    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName(NOME_DA_ABA) || planilha.insertSheet(NOME_DA_ABA);
    if (aba.getLastRow() === 0) { prepararAba(aba); }

    var partes = data.split('-');
    var d = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    var dataBr = Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM/yyyy') + ' (' + DIAS[d.getDay()] + ')';
    var primeiroNome = nome.split(' ')[0];
    var numeroWa = tel.length <= 11 ? '55' + tel : tel;
    var mensagem = 'Olá, ' + primeiroNome + '! Aqui é da ' + NOME_CLINICA + '. Recebemos o seu pedido de agendamento (' + servico +
      ') para ' + dataBr + ', período da ' + periodo.toLowerCase() + '. Vamos confirmar o seu horário?';
    var linkWa = 'https://wa.me/' + numeroWa + '?text=' + encodeURIComponent(mensagem);

    aba.appendRow([new Date(), seguro(nome), formatarTel(tel), servico, dataBr, periodo, 'Novo', '']);
    var linha = aba.getLastRow();
    aba.getRange(linha, 8).setFormula('=HYPERLINK("' + linkWa + '","Chamar no WhatsApp")');

    if (EMAIL_AVISO) {
      MailApp.sendEmail(EMAIL_AVISO, 'Novo pedido de agendamento - ' + nome,
        'Novo pedido de agendamento pelo site:\n\nNome: ' + nome + '\nTelefone: ' + formatarTel(tel) + '\nServiço: ' + servico +
        '\nData preferida: ' + dataBr + '\nPeríodo: ' + periodo + '\n\nAbra a planilha para confirmar: ' + planilha.getUrl());
    }
    return resposta('ok');
  } finally {
    lock.releaseLock();
  }
}

function prepararAba(aba) {
  var titulos = ['Recebido em', 'Nome', 'Telefone', 'Serviço', 'Data preferida', 'Período', 'Status', 'WhatsApp'];
  aba.appendRow(titulos);
  aba.setFrozenRows(1);
  aba.getRange(1, 1, 1, titulos.length).setFontWeight('bold').setBackground('#0B1B3A').setFontColor('#FFFFFF');
  aba.getRange(2, 1, 2000, 1).setNumberFormat('dd/MM/yyyy HH:mm');
  var lista = SpreadsheetApp.newDataValidation().requireValueInList(['Novo', 'Confirmado', 'Cancelado'], true).build();
  aba.getRange(2, 7, 2000, 1).setDataValidation(lista);
  aba.setColumnWidths(1, 1, 130);
  aba.setColumnWidths(2, 1, 220);
  aba.setColumnWidths(3, 1, 140);
  aba.setColumnWidths(4, 1, 190);
  aba.setColumnWidths(5, 1, 150);
  aba.setColumnWidths(8, 1, 170);
}

// Impede que um nome comece com = + - @ e vire fórmula na planilha
function seguro(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function formatarTel(d) {
  if (d.length > 11 && d.indexOf('55') === 0) { d = d.substring(2); }
  if (d.length === 11) { return '(' + d.substring(0, 2) + ') ' + d.substring(2, 7) + '-' + d.substring(7); }
  if (d.length === 10) { return '(' + d.substring(0, 2) + ') ' + d.substring(2, 6) + '-' + d.substring(6); }
  return d;
}

function resposta(texto) {
  return ContentService.createTextOutput(texto).setMimeType(ContentService.MimeType.TEXT);
}
