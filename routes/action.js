const express = require('express');
// const RoundData = require('../models/roundData');
// const UserData = require('../models/userData');
const router = express.Router();



//on game opens call this api to check if user with userid exist if not create it  in DB
router.post("/checkUser", async (req, res) => {
        const uid = req.body.UserId;
        const bal = req.body.Balance;

    try {
        const newUser = new UserData({
            userId: uid,
            balance: bal,
        });

        const user = await UserData.findOne({ 'userId': uid });

        console.log(user);

        if (user === null) {
            console.log(newUser);
            const u = await newUser.save();

            res.status(200).json(u);
            
        } 
        else {
        res.status(200).json(user);
        }

    } catch (error) {
        res.status(500).json(error);
    }
});


// get and update balance -----------------------------------
router.put("/updateBalance", async (req, res) => {
    try {
        const uid = req.body.UserId;
        const newBal = req.body.Balance;

        // console.log(id, newBal);
        const update = await UserData.updateOne({ 'userId': uid }, { '$set': { 'balance': newBal } });

        res.status(200).json(update);

    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/getBalance/:uid", async (req, res) => {
    try {
        const id = req.params.uid;

        const userBal = await UserData.findOne({ 'userId': id });

        res.status(200).json(userBal.balance);
        // console.log(id , userBal);

    } catch (error) {
        res.status(500).send("User doesn't exits.");
    }
});


// bet place api
/// Player history  and  round create
router.put("/updateRoundHistory", async (req, res) => {
    try {
        const uid = req.body.UserId;
        const roundid = req.body.RoundID;
        const detail = req.body.Details;
        let winAmt = 0;

        let winBet = await detail.bets.find(ele => ele.selectedNo === detail.result)
        
        if(winBet !== undefined){
            winAmt = winBet.amountBet * 9;    // 9 times bet amt winning
        }


        const update = await UserData.updateOne({ 'userId': uid }, {
            $push: {
                betHistory: {
                    "roundId": detail.roundId,
                    "dateTime": detail.dateTime,
                    "bets": detail.bets,
                    "winning": winAmt,
                }
            }
        });

        await RoundData.updateOne({ 'roundId': roundid },
            {
                $push: {
                    "betsDetails": {
                        "userId": detail.userid,
                        "dateTime": detail.dateTime,
                        "bets": detail.bets,
                        "winning": winAmt,
                    }
                }
            });

        res.status(200).json(update);

    } catch (error) {
        res.status(500).json(error);
    }
});


// check winners

router.get("/checkWinner/:uid/:roundid", async (req, res) => {
    try {
        const uid = req.params.uid;
        const roundid = req.params.roundid;

        const winner = await UserData.findOne({ 'userId': uid, 'roundId': roundid });
        
        

        res.status(200).json(winner.betHistory.winning);
        // console.log(id , userBal);

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;