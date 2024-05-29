const DB= require ("../model/db.js"); //fichier model avec les infos d'identification
const Model= require ("../model/utilisateur.js");

describe("Model Tests", () => {


    beforeAll(() => {
        // des instructions à exécuter avant le lancement des tests
    });

    afterAll((done) => {
        function callback (err){
            if (err) done (err);
            else done();
            
        }
        DB.end(callback);
    });


    // /!\ par rapport au TD, il faut ajouter done comme paramètre, ...
    // -> done est la fonction de callback qui permet de dire à Jest que le t...
    test("read user",(done)=>{
        nom=null;

        function cbRead(resultat){
            nom = resultat[0]?.nom;
            // Par rapport au code du TD, il faut rajouter le try/catch ...
            // sinon, exception "Exceeded timeout of 5000 ms for a test while waiting for'done()' to be called".
            try{
                expect(nom).toBe("john");
                done();
            }catch(error) {
                done(error)
            }
        }

        // dans la fonction read() du fichier Utilisateur.js, on prend en paramètre le mail, donc on teste avec un mail
        Model.read("@ab.com", cbRead);  
        

    });

    // si on veut faire un test asynchrone (je l'ai pas testé)

    // test("read user ASYNC", async() => {
    //     const user = await module.readAsync("@ab.com");
    //     expect(user[0]?.nom).toBe("john")
    // })

})