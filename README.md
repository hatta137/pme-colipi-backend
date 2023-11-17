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

### `/api/user`

| Methode   | Pfad                                   | Beschreibung                               |
|-----------|----------------------------------------|--------------------------------------------|
| 🟦 GET    | `/api/user/`                           | Gibt alle User mit allen Infos zurück      |
| 🟦 GET    | `/api/user/id`                         | Gibt den User mit der Id zurück            |
| 🟩 POST   | `/api/user/`                           | Legt einen neuen User an                   |
| 🟩 POST   | `/api/user/login`                      | Loggt einen User ein                       |
| 🟥 DELETE | `/api/user/`                           | Löscht den User der gerade angemeldet ist  |
| 🟨 PUT    | `/api/user/`                           | Updatet den User der gerade angemeldet ist |
| 🟨 PUT    | `/api/user/increaseBeercounter/:value` | Erhöht den Beercounter um den angegebenen Wert            |
| 🟨 PUT    | `/api/user/decreaseBeercounter/:value` | Verringert den Beercounter um den angegebenen Wert        |

### `/api/task`

| Methode | Pfad                   | Beschreibung                                           |
|---------|------------------------|--------------------------------------------------------|
| 🟩 POST | `/api/task/`           | Legt einen neuen Task an                               |
| 🟦 GET  | `/api/task/`           | Gibt alle Tasks einer WG aus                           |
| 🟦 GET  | `/api/task/filter/:id` | Gibt einen bestimmten Task basierend auf der ID zurück |
| 🟦 GET  | `/api/task/filter`     | Gibt gefilterte Tasks zurück                           |
| 🟨 PUT  | `/api/task/:id`        | Updatet einen bestimmten  Task basierend auf der ID    |
| 🟥 DELETE | `/api/task/:id`        | Löscht einen Task basierend auf der ID                 |
| 🟥 DELETE | `/api/task/done/:id`   | Markiert einen Task als erledigt basierend auf der ID  |
