import {Router} from "express";
import { useJWT } from "../utils/jwt_utils.js";
import Controller from "../controller/wg_controller.js";

const router = Router();

router.get('/',
    useJWT(),
    Controller.viewWG
);

router.post('/',
    useJWT(),
    Controller.createWG
);

router.put('/',
    useJWT(),
    Controller.renameWG
);

router.delete('/',
    useJWT(),
    Controller.deleteWG
);

router.get('/join',
    useJWT(),
    Controller.joinWG
);

router.get('/leave',
    useJWT(),
    Controller.leaveWG
);

router.get('/kick/:name',
    useJWT(),
    Controller.kickFromWG
);

router.get('/shoppinglist',
    useJWT(),
    Controller.viewShoppingList
);

router.post('/shoppinglist',
    useJWT(),
    Controller.addShoppingListItem
);

router.put('/shoppinglist/check/:id',
    useJWT(),
    Controller.checkShoppingListItem
);

router.put('/shoppinglist/:id',
    useJWT(),
    Controller.updateShoppingListItem
);

router.delete('/shoppinglist/:id',
    useJWT(),
    Controller.removeShoppingListItem
);

export default router;