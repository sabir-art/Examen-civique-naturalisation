/**
 * Mon compte → Assistant et voix.
 *
 * Un seul écran pour : coller une clé (le fournisseur est deviné tout seul),
 * choisir le modèle parmi ceux auxquels la clé donne droit, et régler la voix
 * ElevenLabs. Aucune clé n'est incluse dans l'application : voir js/ai.js.
 */

import { h, icon, toast, confirmDialog } from '../lib/dom.js';
import * as ai from '../ai.js';

export default function renderReglagesIA() {
  const container = h('div', { class: 'stack' });
  draw(container);
  return { node: container, title: 'Assistant et voix', back: '#/compte' };
}

function draw(container) {
  container.replaceChildren(
    h('div', { class: 'hero' }, [
      h('p', { class: 'hero__eyebrow', text: 'Facultatif' }),
      h('h1', { class: 'hero__title', text: 'Assistant et voix' }),
      h('p', { class: 'hero__sub', text: "Branchez votre propre compte d'IA pour obtenir des explications sur mesure, et une voix pour vous les lire. Tout le reste de l'application fonctionne sans." }),
    ]),
    securite(),
    assistantSection(container),
    voixSection(container),
  );
}

/* ------------------------------------------------------------- sécurité */

function securite() {
  return h('details', { class: 'card card--ai' }, [
    h('summary', { class: 'summary' }, [
      icon('info'),
      h('span', { text: 'Où vont mes clés ?' }),
    ]),
    h('div', { class: 'prose', style: 'margin-top:10px', html: `
<p>Ce site est <strong>public</strong> : son code est téléchargé par le navigateur
de chaque visiteur. Une clé placée dedans serait donc lisible — et facturable —
par n'importe qui. C'est pourquoi vous fournissez la vôtre.</p>
<ul>
  <li>Elle est conservée <strong>dans ce navigateur, sur cet appareil</strong>.</li>
  <li>Elle part <strong>uniquement</strong> vers l'API de son fournisseur.</li>
  <li>Elle n'est <strong>ni exportée</strong> avec vos sauvegardes, <strong>ni synchronisée</strong>.</li>
  <li>Pensez à fixer une <strong>limite de dépense</strong> chez le fournisseur.</li>
</ul>
<p>Une clé qu'une autre personne a pu voir doit être <strong>supprimée depuis la
console du fournisseur</strong> : c'est la seule action qui la rende inutilisable.</p>` }),
  ]);
}

/* ------------------------------------------------------------- assistant */

function assistantSection(container) {
  const actif = ai.provider();
  const card = h('div', { class: 'card stack stack--tight' });

  card.append(
    h('div', { class: 'row row--between' }, [
      h('h2', { class: 'card__title', text: "Assistant (texte)" }),
      actif ? h('span', { class: 'badge badge--ok', text: 'Activé' }) : h('span', { class: 'badge', text: 'Non activé' }),
    ]),
    h('p', { class: 'card__sub', text: "Collez la clé de votre choix : Claude, ChatGPT, Gemini ou Mistral. Le fournisseur est reconnu automatiquement." }),
  );

  /* --- clés déjà enregistrées ------------------------------------------- */

  const enregistrees = ai.PROVIDER_LIST.filter((p) => ai.keyOf(p.id));
  if (enregistrees.length) {
    card.append(h('div', { class: 'list', style: 'margin-top:4px' }, enregistrees.map((p) => {
      const courant = p.id === actif;
      return h('div', { class: `item ${courant ? 'item--ai' : ''}` }, [
        h('span', { class: 'item__icon' }, icon(courant ? 'check' : 'cog')),
        h('span', { class: 'item__body' }, [
          h('span', { class: 'item__title', text: p.label }),
          h('span', { class: 'item__sub', text: courant ? `Modèle : ${ai.model(p.id)}` : `Clé ${ai.keyHint(p.id)}` }),
        ]),
        h('div', { class: 'row', style: 'gap:10px' }, [
          courant ? null : h('button', {
            class: 'linkbtn', type: 'button', text: 'Utiliser',
            onclick: () => { ai.useProvider(p.id); draw(container); },
          }),
          h('button', {
            class: 'linkbtn', type: 'button', text: 'Retirer',
            style: 'color:var(--bad)',
            onclick: async () => {
              const ok = await confirmDialog({
                title: `Retirer la clé ${p.label} ?`,
                text: 'Elle sera effacée de cet appareil. Rien d\'autre ne change.',
                confirmLabel: 'Retirer', danger: true,
              });
              if (ok) { ai.forgetKey(p.id); toast('Clé retirée.'); draw(container); }
            },
          }),
        ].filter(Boolean)),
      ]);
    })));
  }

  /* --- ajouter une clé --------------------------------------------------- */

  let forced = null;   // fournisseur imposé quand la clé n'a pas de préfixe connu

  const input = h('input', {
    class: 'input', type: 'password', id: 'ia-key', autocomplete: 'off', spellcheck: 'false',
    placeholder: 'Collez votre clé ici', 'aria-label': 'Clé API',
  });

  const devine = h('p', { class: 'hint', style: 'min-height:17px' });
  input.addEventListener('input', () => {
    const id = forced || ai.detectProvider(input.value);
    devine.textContent = input.value.trim()
      ? (id ? `Reconnu : ${ai.PROVIDERS[id].label}` : 'Format non reconnu — choisissez le fournisseur ci-dessous.')
      : '';
  });

  const choix = h('div', { class: 'chips' }, ai.PROVIDER_LIST.map((p) => h('button', {
    class: 'chip', type: 'button', text: p.label,
    'aria-pressed': 'false',
    onclick: (e) => {
      forced = forced === p.id ? null : p.id;
      for (const b of choix.children) b.setAttribute('aria-pressed', 'false');
      if (forced) e.currentTarget.setAttribute('aria-pressed', 'true');
      input.dispatchEvent(new Event('input'));
    },
  })));

  card.append(
    h('p', { class: 'section-title', style: 'margin-top:8px', text: enregistrees.length ? 'Ajouter ou remplacer une clé' : 'Votre clé' }),
    input,
    devine,
    h('p', { class: 'hint', text: 'Fournisseur (seulement si la clé n\'est pas reconnue) :' }),
    choix,
    h('button', {
      class: 'btn', type: 'button',
      onclick: async () => {
        try {
          const id = ai.setKey(input.value, forced);
          input.value = '';
          toast(`${ai.PROVIDERS[id].label} activé.`);
          draw(container);
        } catch (err) {
          toast(err.message);
        }
      },
    }, [icon('plus'), h('span', { text: 'Enregistrer la clé' })]),
    h('p', { class: 'hint', html: ai.PROVIDER_LIST.map((p) =>
      `<a href="${p.console}" target="_blank" rel="noopener">${p.label}</a>`).join(' · ') }),
  );

  if (actif) card.append(modeles(container, actif));
  return card;
}

/* ---------------------------------------------------------------- modèles */

function modeles(container, providerId) {
  const zone = h('div', { class: 'stack stack--tight', style: 'margin-top:14px' });
  const liste = h('div');
  const choisi = ai.model(providerId);

  function afficher(models) {
    if (!models?.length) { liste.replaceChildren(); return; }
    liste.replaceChildren(
      h('p', { class: 'hint', text: `${models.length} modèles accessibles avec cette clé.` }),
      h('select', {
        class: 'select', style: 'margin-top:6px', 'aria-label': 'Modèle',
        onchange: (e) => { ai.setModel(e.target.value, providerId); toast(`Modèle : ${e.target.value}`); },
      }, models.map((m) => h('option', {
        value: m.id, selected: m.id === ai.model(providerId), text: m.label === m.id ? m.id : `${m.label} — ${m.id}`,
      }))),
    );
  }

  const bouton = h('button', {
    class: 'btn btn--ghost', type: 'button',
    onclick: async () => {
      bouton.disabled = true;
      bouton.replaceChildren(h('span', { text: 'Chargement…' }));
      try {
        afficher(await ai.listModels(providerId));
        toast('Liste des modèles à jour.');
      } catch (err) {
        toast(err.message);
      } finally {
        bouton.disabled = false;
        bouton.replaceChildren(icon('refresh'), h('span', { text: 'Rafraîchir la liste des modèles' }));
      }
    },
  }, [icon('refresh'), h('span', { text: 'Charger les modèles disponibles' })]);

  zone.append(
    h('p', { class: 'section-title', text: 'Modèle utilisé' }),
    h('p', { class: 'small', html: `Actuellement : <strong>${escapeHtml(choisi || '—')}</strong>` }),
    liste,
    bouton,
    h('p', { class: 'hint', text: "La liste vient directement de votre fournisseur : elle ne montre que les modèles auxquels votre clé donne droit." }),
  );

  const cache = ai.cachedModels(providerId);
  if (cache) afficher(cache);
  return zone;
}

/* -------------------------------------------------------------------- voix */

function voixSection(container) {
  const card = h('div', { class: 'card stack stack--tight' });
  const cfg = ai.voiceConfig();

  card.append(
    h('div', { class: 'row row--between' }, [
      h('h2', { class: 'card__title', text: 'Voix (ElevenLabs)' }),
      cfg.key ? h('span', { class: 'badge badge--ok', text: 'Activée' }) : h('span', { class: 'badge', text: 'Voix du téléphone' }),
    ]),
    h('p', { class: 'card__sub', text: cfg.key
      ? "Les explications peuvent être lues à voix haute par la voix que vous choisissez."
      : "Sans clé, la lecture à voix haute utilise la voix intégrée à votre téléphone : gratuite et hors ligne, mais plus mécanique." }),
  );

  if (!cfg.key) {
    const input = h('input', {
      class: 'input', type: 'password', autocomplete: 'off', spellcheck: 'false',
      placeholder: 'Clé ElevenLabs', 'aria-label': 'Clé ElevenLabs',
    });
    card.append(
      input,
      h('button', {
        class: 'btn btn--ghost', type: 'button',
        onclick: () => {
          try { ai.setVoiceKey(input.value); toast('Voix activée.'); draw(container); }
          catch (err) { toast(err.message); }
        },
      }, [icon('plus'), h('span', { text: 'Enregistrer la clé ElevenLabs' })]),
      h('p', { class: 'hint', html: 'Clé à créer sur <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener">elevenlabs.io</a>. L\'offre gratuite suffit pour un usage de révision.' }),
    );
    return card;
  }

  /* --- choix de la voix -------------------------------------------------- */

  const liste = h('div');

  function afficher(voices) {
    liste.replaceChildren(h('select', {
      class: 'select', 'aria-label': 'Voix',
      onchange: (e) => {
        const opt = e.target.selectedOptions[0];
        ai.setVoice(e.target.value, opt.dataset.name);
        toast(`Voix : ${opt.dataset.name}`);
      },
    }, voices.map((v) => h('option', {
      value: v.id, selected: v.id === cfg.voiceId, dataset: { name: v.name },
      text: v.note ? `${v.name} — ${v.note}` : v.name,
    }))));
  }

  // Le diagnostic remplace un message d'erreur vague : ElevenLabs indique dans
  // sa réponse s'il s'agit d'une clé fausse, de permissions manquantes ou d'un
  // quota atteint, et ce n'est pas la même chose à corriger.
  const diag = h('p', { class: 'hint', style: 'min-height:17px' });

  const charger = h('button', {
    class: 'btn btn--ghost', type: 'button',
    onclick: async () => {
      charger.disabled = true;
      diag.textContent = 'Chargement…';
      diag.className = 'hint';
      try {
        afficher(await ai.listVoices());
        diag.textContent = '';
      } catch (err) {
        diag.textContent = err.message;
        diag.className = 'hint hint--bad';
      } finally {
        charger.disabled = false;
      }
    },
  }, [icon('refresh'), h('span', { text: 'Charger mes voix' })]);

  const tester = h('button', {
    class: 'btn btn--quiet', type: 'button',
    onclick: async () => {
      diag.textContent = 'Vérification…';
      diag.className = 'hint';
      const r = await ai.testVoiceKey();
      diag.textContent = r.message;
      diag.className = `hint hint--${r.ok ? 'ok' : 'bad'}`;
    },
  }, [icon('check'), h('span', { text: 'Vérifier la clé' })]);

  // Repli : certaines clés n'ont pas le droit de lister les voix mais peuvent
  // parler. On accepte alors un identifiant de voix collé à la main.
  const manuel = h('input', {
    class: 'input', type: 'text', placeholder: 'ou collez un identifiant de voix',
    'aria-label': 'Identifiant de voix', value: cfg.voiceId || '',
    autocapitalize: 'off', spellcheck: 'false',
    onchange: (e) => {
      const v = e.target.value.trim();
      if (v) { ai.setVoice(v, `voix ${v.slice(0, 6)}…`); toast('Voix enregistrée.'); }
    },
  });

  card.append(
    h('p', { class: 'small', html: `Clé enregistrée : <strong>${escapeHtml(ai.voiceKeyHint())}</strong>${cfg.voiceName ? ` · voix <strong>${escapeHtml(cfg.voiceName)}</strong>` : ''}` }),
    liste,
    charger,
    diag,
    tester,
    h('details', { class: 'deepen__box' }, [
      h('summary', { class: 'summary' }, [icon('info'), h('span', { text: 'La voix ne marche pas ?' })]),
      h('div', { class: 'deepen__inner' }, [
        h('div', { class: 'prose', html: `
<p>Presque toujours, la clé est bonne mais ses <strong>permissions</strong> sont
trop étroites. Sur <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener">elevenlabs.io → API Keys</a>,
modifiez la clé et cochez au minimum :</p>
<ul><li><strong>Voices</strong> : Read</li><li><strong>Text to Speech</strong> : Access</li><li><strong>User</strong> : Read (pour le bouton « Vérifier la clé »)</li></ul>
<p>Si vous ne pouvez pas changer les permissions, collez directement l'identifiant
d'une voix ci-dessous : il se trouve dans l'adresse de la page de la voix, sur le
site d'ElevenLabs.</p>` }),
        manuel,
      ]),
    ]),
    h('button', {
      class: 'btn btn--quiet', type: 'button',
      onclick: async () => {
        try { await ai.speak("Bonjour. La devise de la République française est : Liberté, Égalité, Fraternité."); }
        catch (err) { toast(err.message); }
      },
    }, [icon('play'), h('span', { text: 'Écouter un exemple' })]),
    h('button', {
      class: 'btn btn--danger', type: 'button',
      onclick: async () => {
        const ok = await confirmDialog({
          title: 'Retirer la clé ElevenLabs ?',
          text: 'La lecture à voix haute repassera sur la voix du téléphone.',
          confirmLabel: 'Retirer', danger: true,
        });
        if (ok) { ai.forgetVoiceKey(); toast('Clé retirée.'); draw(container); }
      },
    }, [icon('trash'), h('span', { text: 'Retirer la clé ElevenLabs' })]),
  );

  return card;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
