import express from 'express';
import path from 'path';
import fs from 'fs'
import { PATH_DATA } from 'src/paths';

const PATH_POGCHAMP = path.join(PATH_DATA, "pogchamp.json")
  
class PogChamp {
    
    public static days = 30;

    constructor(app: express.Application)
    {
        console.log("PogChamp starting");

        if(!fs.existsSync(PATH_POGCHAMP)) {
            fs.writeFileSync(PATH_POGCHAMP, `${(new Date()).getTime()}`)
        }

        const minTime = (1000 * 60 * 60 * 24 * PogChamp.days);
        

        app.get("/pogchamp", (req, res) => {
            const nowDate = new Date();
            const time = parseInt(fs.readFileSync(PATH_POGCHAMP, "utf-8"));
            const targetDate = new Date(new Date(time).getTime() + minTime);
            const diff = targetDate.getTime() - nowDate.getTime();

            console.log(nowDate, targetDate);

            if(diff < 0) {
                res.end("https://drive.google.com/file/d/10hcVwQRzG4VxpxNNyQLznMPQRdaiNp1g/view?usp=sharing");
            } else {
                res.end(`Important message (some truths) in: ${diff} ms`);
            }
        });
    }
}

export default PogChamp;