# 🛋️ CoLiPi Backend

## Port

Das Backend ist vorläufig unter dem Port `20013` erreichbar.

## Implementierte Routen:

### `/api/wg`

| Methode   | Pfad                       | Beschreibung                                                      |
|-----------|----------------------------|-------------------------------------------------------------------|
| ⚠️ GET    | `/api/wg/test-auth`        | Vorläufiges Login als Nutzer "test" (muss vorher angelegt werden) |
| 🟦 GET    | `/api/wg/`                 | WG-Infos abrufen                                                  |
| 🟩 POST   | `/api/wg/`                 | WG erstellen                                                      |
| 🟦 GET    | `/api/wg/join?code=...`    | WG beitreten                                                      |
| 🟦 GET    | `/api/wg/leave`            | WG verlassen                                                      |
| 🟦 GET    | `/api/wg/kick/:id`         | Nutzer aus WG entfernen                                           |
| 🟦 GET    | `/api/wg/shoppinglist`     | Einkaufsliste abrufen                                             |
| 🟩 POST   | `/api/wg/shoppinglist`     | Einkaufsliste Eintrag hinzufügen                                  |
| 🟥 DELETE | `/api/wg/shoppinglist/:id` | Einkaufsliste Eintrag entfernen                                   |
