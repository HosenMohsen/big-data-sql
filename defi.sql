/* défi 01 */

SELECT
    c.pays AS pays,
    COUNT(DISTINCT c.id)             AS nb_commandes,
    ROUND(SUM(pi.quantite * vp.price), 2)                         AS chiffre_affaires,
    ROUND(SUM(pi.quantite * vp.price) / COUNT(DISTINCT c.id), 2)  AS montant_moyen
FROM commandes c
JOIN panier_item pi    ON pi.panier_id   = c.panier_id
JOIN variantes_prix vp ON vp.variante_id = pi.variante_id
WHERE c.etat IN ('payee', 'expediee', 'livree')
GROUP BY pays
ORDER BY chiffre_affaires DESC;



/* défi 2 quelles sont les 20 villes au panier moyen le plus élevé, parmi celles ayant au moins 30 commandes */

 SELECT
    c.ville,
    COUNT(DISTINCT c.id)                                          AS nb_commandes,
    ROUND(SUM(pi.quantite * vp.price) / COUNT(DISTINCT c.id), 2)  AS montant_moyen
FROM commandes c
JOIN panier_item pi    ON pi.panier_id   = c.panier_id
JOIN variantes_prix vp ON vp.variante_id = pi.variante_id
WHERE c.etat IN ('payee', 'expediee', 'livree')
GROUP BY c.ville
HAVING COUNT(DISTINCT c.id) >= 30
ORDER BY montant_moyen DESC
LIMIT 20;


/* défi 3 quels sont les 50 clients avec le plus de commandes payées sur les 12 mois ? Affichez aussi leur dépense totale. */

SELECT
    u.id,
    u.name                                         AS client,
    COUNT(DISTINCT c.id)                           AS nb_commandes,
    ROUND(SUM(pi.quantite * vp.price), 2)          AS depense_totale
FROM commandes c
JOIN users u           ON u.id           = c.user_id
JOIN panier_item pi    ON pi.panier_id   = c.panier_id
JOIN variantes_prix vp ON vp.variante_id = pi.variante_id
WHERE c.etat IN ('payee', 'expediee', 'livree')
  AND c.creation_date >= NOW() - INTERVAL '12 months'
GROUP BY u.id, u.name
ORDER BY nb_commandes DESC, depense_totale DESC
LIMIT 50;



/*  défi 4 Quelles variantes actives du catalogue n'ont jamais été achetées ?   */

SELECT v.id, v.sku, p.nom AS produit
FROM variantes v
JOIN produits p ON p.id = v.product_id
WHERE v.stock > 0
  AND NOT EXISTS (
      SELECT 1
      FROM panier_item pi
      JOIN commandes c ON c.panier_id = pi.panier_id
      WHERE pi.variante_id = v.id
        AND c.etat IN ('payee', 'expediee', 'livree')
  )
ORDER BY p.nom;

/* défi 5 Classez les marques par chiffre d'affaires en tenant compte des quantités et des prix réellement payés.  */


SELECT
    RANK() OVER (ORDER BY SUM(pi.quantite * vp.price) DESC)  AS rang,
    m.name                                                   AS marque,
    COUNT(DISTINCT c.id)                                     AS nb_commandes,
    ROUND(SUM(pi.quantite * vp.price), 2)                    AS chiffre_affaires
FROM commandes c
JOIN panier_item pi    ON pi.panier_id   = c.panier_id
JOIN variantes v       ON v.id           = pi.variante_id
JOIN variantes_prix vp ON vp.variante_id = v.id
JOIN produits p        ON p.id           = v.product_id
JOIN marques m         ON m.id           = p.marque_id
WHERE c.etat IN ('payee', 'expediee', 'livree')
GROUP BY m.id, m.name
ORDER BY chiffre_affaires DESC;




/* défi 7  quels clients ayant déjà acheté n'ont rien commandé depuis 180 jours ?  */

SELECT
    u.id,
    u.name                  AS client,
    MAX(c.creation_date)    AS derniere_commande
FROM commandes c
JOIN users u ON u.id = c.user_id
GROUP BY u.id, u.name
HAVING MAX(c.creation_date) < NOW() - INTERVAL '180 days'
ORDER BY derniere_commande;


/* défi 8 quelle catégorie réalise le plus de ventes de dans chaques pays ? Un produit peut appartenir à plusieurs catégories  */

SELECT DISTINCT ON (c.pays)
    c.pays,
    cat.nom                                   AS categorie,
    ROUND(SUM(pi.quantite * vp.price), 2)     AS ventes
FROM commandes c
JOIN panier_item pi        ON pi.panier_id   = c.panier_id
JOIN variantes v           ON v.id           = pi.variante_id
JOIN variantes_prix vp     ON vp.variante_id = v.id
JOIN produits p            ON p.id           = v.product_id
JOIN produit_categories pc ON pc.produit_id  = p.id
JOIN categories cat        ON cat.id         = pc.categorie_id
WHERE c.etat IN ('payee', 'expediee', 'livree')
GROUP BY c.pays, cat.nom
ORDER BY c.pays, SUM(pi.quantite * vp.price) DESC;



/* défi 18 quelle est la variation en euros et en pourcentage du CA par pays par rapport au mois précédent, y compris les mois à zéro */

WITH ca_complet AS (
    SELECT
        p.pays,
        m.mois,
        COALESCE(SUM(pi.quantite * vp.price), 0) AS ca
    FROM (SELECT DISTINCT pays FROM commandes) p
    CROSS JOIN generate_series(
        (SELECT DATE_TRUNC('month', MIN(creation_date)) FROM commandes),
        (SELECT DATE_TRUNC('month', MAX(creation_date)) FROM commandes),
        INTERVAL '1 month'
    ) AS m(mois)
    LEFT JOIN commandes c       ON c.pays = p.pays
                               AND DATE_TRUNC('month', c.creation_date) = m.mois
                               AND c.etat IN ('payee', 'expediee', 'livree')
    LEFT JOIN panier_item pi    ON pi.panier_id   = c.panier_id
    LEFT JOIN variantes_prix vp ON vp.variante_id = pi.variante_id
    GROUP BY p.pays, m.mois
)
SELECT
    pays,
    TO_CHAR(mois, 'YYYY-MM')                                             AS mois,
    ROUND(ca, 2)                                                         AS ca,
    ROUND(ca - LAG(ca) OVER w, 2)                                        AS variation_eur,
    ROUND((ca - LAG(ca) OVER w) / NULLIF(LAG(ca) OVER w, 0) * 100, 1)    AS variation_pct
FROM ca_complet
WINDOW w AS (PARTITION BY pays ORDER BY mois)
ORDER BY pays, mois;



/* défi 19 quelle proportion des clients repasse commandes dans les 30, 60 et 90 jours après leur premier achat ?  */

SELECT
    COUNT(DISTINCT p.user_id) AS nb_clients,
    ROUND(100.0 * COUNT(DISTINCT c2.user_id) FILTER (WHERE c2.creation_date <= p.premier_achat + INTERVAL '30 days')
          / COUNT(DISTINCT p.user_id), 1) AS pct_30_jours,
    ROUND(100.0 * COUNT(DISTINCT c2.user_id) FILTER (WHERE c2.creation_date <= p.premier_achat + INTERVAL '60 days')
          / COUNT(DISTINCT p.user_id), 1) AS pct_60_jours,
    ROUND(100.0 * COUNT(DISTINCT c2.user_id) FILTER (WHERE c2.creation_date <= p.premier_achat + INTERVAL '90 days')
          / COUNT(DISTINCT p.user_id), 1) AS pct_90_jours
FROM (
    SELECT user_id, MIN(creation_date) AS premier_achat
    FROM commandes
    WHERE etat IN ('payee', 'expediee', 'livree')
      AND user_id IS NOT NULL
    GROUP BY user_id
) p
LEFT JOIN commandes c2
       ON c2.user_id = p.user_id
      AND c2.etat IN ('payee', 'expediee', 'livree')
      AND c2.creation_date > p.premier_achat
WHERE p.premier_achat <= NOW() - INTERVAL '90 days';


/* défi 20 Quelles paires de variantes sont les plus fréquentes dans une même commande ? Comptez chaque paire une fois par commande. 
 */


SELECT
    va.sku                  AS variante_1,
    vb.sku                  AS variante_2,
    COUNT(DISTINCT c.id)    AS nb_commandes
FROM commandes c
JOIN panier_item a ON a.panier_id = c.panier_id
JOIN panier_item b ON b.panier_id = c.panier_id
                  AND a.variante_id < b.variante_id
JOIN variantes va  ON va.id = a.variante_id
JOIN variantes vb  ON vb.id = b.variante_id
WHERE c.etat IN ('payee', 'expediee', 'livree')
GROUP BY a.variante_id, b.variante_id, va.sku, vb.sku
ORDER BY nb_commandes DESC
LIMIT 15;


