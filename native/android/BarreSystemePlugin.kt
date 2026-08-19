package fr.examencivique.app

/*
 * Barre d'onglets Android — le pendant du greffon iOS.
 *
 * Même contrat, matériau différent : ici c'est Material 3 qui rend la barre,
 * avec les couleurs dynamiques du téléphone (Material You) quand le système
 * les expose. On ne copie donc pas le verre d'Apple sur Android : une
 * application qui porte le matériau d'un autre système n'a l'air d'être de
 * nulle part.
 *
 * Comme sur iOS, le greffon ne navigue pas : il signale l'onglet appuyé, et le
 * routeur reste dans la page.
 */

import android.view.Gravity
import android.view.ViewGroup
import android.widget.FrameLayout
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.android.material.bottomnavigation.BottomNavigationView

@CapacitorPlugin(name = "BarreSysteme")
class BarreSystemePlugin : Plugin() {

    private var barre: BottomNavigationView? = null
    private val valeurs = mutableListOf<String>()

    @PluginMethod
    fun afficher(call: PluginCall) {
        val onglets = call.getArray("onglets") ?: return call.reject("Onglets manquants")
        val actif = call.getString("actif")

        activity.runOnUiThread {
            val vue = barre ?: creerLaBarre()
            barre = vue

            valeurs.clear()
            vue.menu.clear()
            for (i in 0 until onglets.length()) {
                val onglet = onglets.getJSONObject(i)
                valeurs.add(onglet.getString("value"))
                vue.menu.add(0, i, i, onglet.optString("label"))
                    .setIcon(iconeAndroid(onglet.optString("value")))
            }
            selectionner(actif)
            call.resolve()
        }
    }

    @PluginMethod
    fun selectionner(call: PluginCall) {
        activity.runOnUiThread {
            selectionner(call.getString("actif"))
            call.resolve()
        }
    }

    @PluginMethod
    fun hauteur(call: PluginCall) {
        activity.runOnUiThread {
            call.resolve(JSObject().put("hauteur", (barre?.height ?: 0) / activity.resources.displayMetrics.density))
        }
    }

    @PluginMethod
    fun masquer(call: PluginCall) {
        activity.runOnUiThread {
            (barre?.parent as? ViewGroup)?.removeView(barre)
            barre = null
            call.resolve()
        }
    }

    private fun creerLaBarre(): BottomNavigationView {
        val vue = BottomNavigationView(context)
        vue.setOnItemSelectedListener { item ->
            val valeur = valeurs.getOrNull(item.itemId)
            if (valeur != null) {
                // On signale, on ne navigue pas.
                notifyListeners("ongletChoisi", JSObject().put("value", valeur))
            }
            true
        }
        val parametres = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            Gravity.BOTTOM
        )
        (bridge.webView.parent as ViewGroup).addView(vue, parametres)
        return vue
    }

    /** Les icônes vectorielles du dossier `res/drawable`, pas celles de la page. */
    private fun iconeAndroid(valeur: String): Int = when (valeur) {
        "/" -> R.drawable.ic_accueil
        "/histoire" -> R.drawable.ic_histoire
        "/reviser" -> R.drawable.ic_reviser
        "/examen" -> R.drawable.ic_examen
        else -> R.drawable.ic_progres
    }

    private fun selectionner(valeur: String?) {
        val index = valeurs.indexOf(valeur ?: return)
        if (index >= 0) barre?.menu?.findItem(index)?.isChecked = true
    }
}
