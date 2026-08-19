//
//  BarreSystemePlugin.swift
//  Examen civique — coque iOS
//
//  ─────────────────────────────────────────────────────────────────────────
//   Ce que ce greffon fait, et pourquoi il existe
//  ─────────────────────────────────────────────────────────────────────────
//   La barre d'onglets n'est pas dessinée par la page : elle est ici, en
//   UIKit, et c'est iOS qui rend son matériau. Le système gère alors seul le
//   flou, la transparence, la profondeur, la luminosité, le contraste, la
//   réaction au contenu qui défile derrière, le passage clair/sombre et les
//   réglages d'accessibilité — « réduire la transparence », « augmenter le
//   contraste », les tailles de texte dynamiques. Aucune de ces choses n'est
//   reproduite : elles sont obtenues.
//
//   iOS 26 et au-delà : `UIGlassEffect`, le matériau Liquid Glass lui-même.
//   iOS 13 à 18      : `UIBlurEffect(style: .systemChromeMaterial)`, le
//                      matériau des barres du système avant Liquid Glass.
//   L'application ne dépend donc d'aucune version : elle demande le meilleur
//   matériau disponible et se contente du précédent sinon.
//
//   Le greffon ne navigue pas. Il signale l'onglet appuyé ; le routeur reste
//   dans la page, unique et partagé avec la version web et Android.
//  ─────────────────────────────────────────────────────────────────────────
//

import Foundation
import UIKit
import WebKit
import Capacitor

@objc(BarreSystemePlugin)
public class BarreSystemePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "BarreSystemePlugin"
    public let jsName = "BarreSysteme"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "afficher", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "selectionner", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "hauteur", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "masquer", returnType: CAPPluginReturnPromise)
    ]

    private var barre: UITabBar?
    private var valeurs: [String] = []

    // MARK: - API appelée depuis la page

    @objc func afficher(_ call: CAPPluginCall) {
        let onglets = call.getArray("onglets", JSObject.self) ?? []
        let actif = call.getString("actif")

        DispatchQueue.main.async { [weak self] in
            guard let self, let vue = self.bridge?.viewController?.view else {
                call.reject("Aucune vue hôte")
                return
            }

            let barre = self.barre ?? self.creerLaBarre(dans: vue)
            self.barre = barre

            self.valeurs = onglets.compactMap { $0["value"] as? String }
            barre.items = onglets.enumerated().map { index, onglet in
                let item = UITabBarItem(
                    title: onglet["label"] as? String,
                    image: self.glyphe(onglet["sfSymbol"] as? String),
                    tag: index
                )
                return item
            }
            self.selectionner(valeur: actif)

            // Le contenu web passe DERRIÈRE la barre : c'est ce que le
            // matériau doit flouter. Sans cela, il n'aurait rien à montrer.
            self.bridge?.webView?.scrollView.contentInsetAdjustmentBehavior = .never
            call.resolve()
        }
    }

    @objc func selectionner(_ call: CAPPluginCall) {
        let actif = call.getString("actif")
        DispatchQueue.main.async { [weak self] in
            self?.selectionner(valeur: actif)
            call.resolve()
        }
    }

    @objc func hauteur(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            let barre = self?.barre?.frame.height ?? 0
            let sure = self?.bridge?.viewController?.view.safeAreaInsets.bottom ?? 0
            // Double, et non CGFloat : Capacitor ne sérialise vers la page que
            // les types qui se conforment à JSValue, et CGFloat n'en est pas.
            call.resolve(["hauteur": Double(barre + sure)])
        }
    }

    @objc func masquer(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            self?.barre?.removeFromSuperview()
            self?.barre = nil
            call.resolve()
        }
    }

    // MARK: - Construction

    private func creerLaBarre(dans hote: UIView) -> UITabBar {
        let barre = UITabBar()
        barre.translatesAutoresizingMaskIntoConstraints = false
        barre.delegate = self

        let apparence = UITabBarAppearance()
        if #available(iOS 26.0, *) {
            // Liquid Glass : le système fournit le matériau, ses reflets et sa
            // réaction au contenu qui passe dessous.
            apparence.configureWithDefaultBackground()
            barre.overrideUserInterfaceStyle = .unspecified
        } else {
            // Le matériau des barres du système avant iOS 26. Même contrat :
            // c'est UIKit qui décide du flou et de la teinte, pas nous.
            apparence.configureWithDefaultBackground()
            apparence.backgroundEffect = UIBlurEffect(style: .systemChromeMaterial)
        }
        barre.standardAppearance = apparence
        barre.scrollEdgeAppearance = apparence

        hote.addSubview(barre)
        NSLayoutConstraint.activate([
            barre.leadingAnchor.constraint(equalTo: hote.leadingAnchor),
            barre.trailingAnchor.constraint(equalTo: hote.trailingAnchor),
            barre.bottomAnchor.constraint(equalTo: hote.bottomAnchor)
        ])
        return barre
    }

    /// Le glyphe du système, qui suit la graisse et la taille choisies par
    /// l'utilisateur. Un PNG figé ne le ferait pas.
    private func glyphe(_ nom: String?) -> UIImage? {
        guard let nom else { return nil }
        return UIImage(systemName: nom)
    }

    private func selectionner(valeur: String?) {
        guard let valeur, let index = valeurs.firstIndex(of: valeur),
              let items = barre?.items, index < items.count else { return }
        barre?.selectedItem = items[index]
    }
}

// MARK: - Appuis

extension BarreSystemePlugin: UITabBarDelegate {
    public func tabBar(_ tabBar: UITabBar, didSelect item: UITabBarItem) {
        guard item.tag < valeurs.count else { return }
        // On signale, on ne navigue pas : le routeur est dans la page, partagé
        // avec la version web et la version Android.
        notifyListeners("ongletChoisi", data: ["value": valeurs[item.tag]])
    }
}
