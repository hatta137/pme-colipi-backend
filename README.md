# 🛋️ CoLiPi Backend

## Port

Das Backend ist vorläufig unter dem Port `20013` erreichbar.

## Implementierte Routen:

### `/api/wg`

| Methode   | Pfad                             | Beschreibung                     |
|-----------|----------------------------------|----------------------------------|
| 🟦 GET    | `/api/wg/`                       | WG-Infos abrufen                 |
| 🟩 POST   | `/api/wg/`                       | WG erstellen                     |
| 🟨 PUT    | `/api/wg/`                       | WG umbenennen                    |
| 🟥 DELETE | `/api/wg/`                       | WG entfernen                     |
| 🟦 GET    | `/api/wg/join?code=...`          | WG beitreten                     |
| 🟦 GET    | `/api/wg/leave`                  | WG verlassen                     |
| 🟦 GET    | `/api/wg/kick/:id`               | Nutzer aus WG entfernen          |
| 🟦 GET    | `/api/wg/shoppinglist`           | Einkaufsliste abrufen            |
| 🟩 POST   | `/api/wg/shoppinglist`           | Einkaufsliste Eintrag hinzufügen |
| 🟨 PUT    | `/api/wg/shoppinglist/check/:id` | Einkaufsliste Eintrag abhaken    |
| 🟨 PUT    | `/api/wg/shoppinglist/:id`       | Einkaufsliste Eintrag verändern  |
| 🟥 DELETE | `/api/wg/shoppinglist/:id`       | Einkaufsliste Eintrag entfernen  |

### `/api/user`

| Methode   | Pfad                                   | Beschreibung                                       |
|-----------|----------------------------------------|----------------------------------------------------|
| 🟦 GET    | `/api/user/`                           | Gibt alle User mit allen Infos zurück              |
| 🟦 GET    | `/api/user/:id`                        | Gibt einen User anhand der ID zurück               |
| 🟩 POST   | `/api/user/`                           | Registrierung eines neuen Users                    |
| 🟩 POST   | `/api/user/login`                      | Loggt einen User ein                               |
| 🟥 DELETE | `/api/user/`                           | Löscht den User der gerade angemeldet ist          |
| 🟨 PUT    | `/api/user/`                           | Updatet den User der gerade angemeldet ist         |

### `/api/task`

| Methode   | Pfad                   | Beschreibung                                           |
|-----------|------------------------|--------------------------------------------------------|
| 🟩 POST   | `/api/task/`           | Legt einen neuen Task an                               |
| 🟦 GET    | `/api/task/`           | Gibt alle Tasks einer WG aus                           |
| 🟦 GET    | `/api/task/filter/:id` | Gibt einen bestimmten Task basierend auf der ID zurück |
| 🟦 GET    | `/api/task/filter`     | Gibt gefilterte Tasks zurück                           |
| 🟨 PUT    | `/api/task/:id`        | Updatet einen bestimmten  Task basierend auf der ID    |
| 🟥 DELETE | `/api/task/:id`        | Löscht einen Task basierend auf der ID                 |
| 🟥 DELETE | `/api/task/done/:id`   | Markiert einen Task als erledigt basierend auf der ID  |
