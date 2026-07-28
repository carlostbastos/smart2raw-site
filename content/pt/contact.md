---
title: Contato Smart2Raw — licença comercial, versão avançada, parcerias
description: Fale com quem escreveu. Licenciamento comercial, acesso à versão avançada, avaliação técnica e investimento.
---

# Contato

Não há um balcão de suporte entre você e o projeto. O que você escrever aqui
chega em quem escreveu a biblioteca.

**Escreva se você quer:** licenciar o Smart2Raw para um produto que você não
publica sob AGPL · ter acesso à versão avançada · avaliar com o seu próprio dado
e quer uma mão · conversar sobre investimento ou parceria · relatar um defeito,
que é sempre bem-vindo.

::html
<div class="panel" style="margin-top:8px">
<form id="cform" action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="4cdfa100-6d7a-4481-a8f4-01c510dbe166">
  <input type="hidden" name="subject" value="Smart2Raw — contato pelo site">
  <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">
  <div class="frow"><label>Nome<input type="text" name="name" required></label>
  <label>E-mail<input type="email" name="email" required></label></div>
  <div class="frow"><label>Empresa ou instituição<input type="text" name="company"></label>
  <label>O que traz você aqui
    <select name="topic">
      <option>Licença comercial</option>
      <option>Acesso à versão avançada</option>
      <option>Avaliação técnica</option>
      <option>Investimento ou parceria</option>
      <option>Relato de defeito</option>
      <option>Outro assunto</option>
    </select></label></div>
  <div class="frow"><label>Tamanho do dado com que você trabalha
    <select name="volume">
      <option>Menos de 1 GB</option><option>1 GB a 1 TB</option>
      <option>1 TB a 100 TB</option><option>Mais de 100 TB</option>
      <option>Não se aplica</option>
    </select></label>
  <label>Prazo
    <select name="timeframe">
      <option>Só explorando</option><option>Em até 3 meses</option>
      <option>Em até 12 meses</option><option>Já estou travado nisso</option>
    </select></label></div>
  <label style="display:block">Mensagem<textarea name="message" rows="6" required
    placeholder="Qual coluna, quantos elementos, o que você está tentando fazer."></textarea></label>
  <div class="row" style="margin-top:6px">
    <button class="btn" type="submit" id="csend">Enviar</button>
    <span class="dim small" id="cstat"></span>
  </div>
</form>
</div>
<p class="dim small" style="margin-top:10px">Prefere e-mail direto? Escreva para <a href="mailto:contato@smart2raw.com">contato@smart2raw.com</a> — chega na mesma pessoa.</p>
<script>
(function(){
  var f=document.getElementById('cform'), k=f.access_key.value,
      st=document.getElementById('cstat'), MAIL='contato@smart2raw.com';
  if(k.indexOf('S2R_WEB3FORMS')===0){
    document.getElementById('csend').disabled=true;
    st.innerHTML='O formulário ainda não está ligado — escreva para <a href="mailto:'+MAIL+'">'+MAIL+'</a>.';
    return;
  }
  f.addEventListener('submit',function(e){
    e.preventDefault(); st.textContent='enviando…';
    fetch(f.action,{method:'POST',body:new FormData(f)})
      .then(function(r){return r.json()})
      .then(function(j){ st.innerHTML = j.success
        ? '<span class="ok">Enviado. A resposta vai para o endereço que você deu.</span>'
        : 'Algo falhou. Escreva para <a href="mailto:'+MAIL+'">'+MAIL+'</a>.';
        if(j.success) f.reset(); })
      .catch(function(){ st.innerHTML='Algo falhou. Escreva para <a href="mailto:'+MAIL+'">'+MAIL+'</a>.'; });
  });
})();
</script>
::

## O que acontece com o que você escreve

É usado para responder a você e para avaliar uma possível licença comercial, e
nada além disso. Não é vendido, não é compartilhado e não vira lista de
marketing. Os detalhes estão na [página de privacidade](/pt/privacidade/), que é
curta.

## Os outros caminhos

- **Defeitos e dúvidas sobre o código:** [issues no GitHub](https://github.com/carlostbastos/Smart2Raw/issues) — público, e o mais rápido.
- **Citação e uso acadêmico:** está tudo na [página de citar](/pt/citar/).
