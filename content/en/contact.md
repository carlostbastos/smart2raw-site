---
title: Contact Smart2Raw — commercial licence, the advanced version, partnerships
description: Talk to the person who wrote it. Commercial licensing, access to the advanced version, technical evaluation and investment.
---

# Contact

There is no support desk between you and the project. What you write here reaches
the person who wrote the library.

**Write if you want to:** license Smart2Raw for a product you do not publish
under AGPL · get access to the advanced version · evaluate it on your own data
and want a hand · discuss investment or partnership · report a defect, which is
always welcome.

::html
<div class="panel" style="margin-top:8px">
<form id="cform" action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="4cdfa100-6d7a-4481-a8f4-01c510dbe166">
  <input type="hidden" name="subject" value="Smart2Raw — contact from the site">
  <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">
  <div class="frow"><label>Name<input type="text" name="name" required></label>
  <label>E-mail<input type="email" name="email" required></label></div>
  <div class="frow"><label>Company or institution<input type="text" name="company"></label>
  <label>What brings you here
    <select name="topic">
      <option>Commercial licence</option>
      <option>Access to the advanced version</option>
      <option>Technical evaluation</option>
      <option>Investment or partnership</option>
      <option>Defect report</option>
      <option>Something else</option>
    </select></label></div>
  <div class="frow"><label>Size of the data you work with
    <select name="volume">
      <option>Under 1 GB</option><option>1 GB to 1 TB</option>
      <option>1 TB to 100 TB</option><option>Over 100 TB</option>
      <option>Not applicable</option>
    </select></label>
  <label>Timeframe
    <select name="timeframe">
      <option>Just exploring</option><option>Within 3 months</option>
      <option>Within 12 months</option><option>Already blocked on it</option>
    </select></label></div>
  <label style="display:block">Message<textarea name="message" rows="6" required
    placeholder="Which column, how many elements, what you are trying to do."></textarea></label>
  <div class="row" style="margin-top:6px">
    <button class="btn" type="submit" id="csend">Send</button>
    <span class="dim small" id="cstat"></span>
  </div>
</form>
</div>
<p class="dim small" style="margin-top:10px">Prefer plain e-mail? Write straight to <a href="mailto:contact@smart2raw.com">contact@smart2raw.com</a> — it reaches the same person.</p>
<script>
(function(){
  var f=document.getElementById('cform'), k=f.access_key.value,
      st=document.getElementById('cstat'), MAIL='contact@smart2raw.com';
  if(k.indexOf('S2R_WEB3FORMS')===0){
    document.getElementById('csend').disabled=true;
    st.innerHTML='The form is not connected yet — write to <a href="mailto:'+MAIL+'">'+MAIL+'</a>.';
    return;
  }
  f.addEventListener('submit',function(e){
    e.preventDefault(); st.textContent='sending…';
    fetch(f.action,{method:'POST',body:new FormData(f)})
      .then(function(r){return r.json()})
      .then(function(j){ st.innerHTML = j.success
        ? '<span class="ok">Sent. You will get an answer at the address you gave.</span>'
        : 'Something failed. Write to <a href="mailto:'+MAIL+'">'+MAIL+'</a>.';
        if(j.success) f.reset(); })
      .catch(function(){ st.innerHTML='Something failed. Write to <a href="mailto:'+MAIL+'">'+MAIL+'</a>.'; });
  });
})();
</script>
::

## What happens to what you write

It is used to answer you and to evaluate a possible commercial licence, and
nothing else. It is not sold, not shared and not turned into a marketing list.
The details are on the [privacy page](/privacy/), which is short.

## The other ways

- **Defects and questions about the code:** [GitHub issues](https://github.com/carlostbastos/Smart2Raw/issues) — public, and the fastest.
- **Citation and academic use:** everything is on the [cite page](/cite/).
