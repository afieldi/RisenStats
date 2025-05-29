
const fetch = require('node-fetch');
const fs = require('fs');

// import fetch from 'node-fetch';
// import fs from 'fs';

const imagePath = "./public/images";
const dataPath = './src/data';
const backendDataPath = '../BackEnd/data'

const paths = [
  `${imagePath}/champions`,
  `${imagePath}/champions/icons`,
  `${imagePath}/champions/profile`,
  `${imagePath}/champions/splash`,
  `${imagePath}/items`,
  `${imagePath}/summoner`,
  `${imagePath}/runes`,
  `${dataPath}`,
  backendDataPath,
]
for (let path of paths) {
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }
}

const OPGG_ROLE_TO_GAMEROLE = (role) => {
  if (role === 'MID') {
    return 'MIDDLE';
  }
  if (role === 'ADC') {
    return 'BOTTOM';
  }
  return role;
}

// fetch("https://lol-web-api.op.gg/api/v1.0/internal/bypass/champions/na/ranked")
//   .then(response => response.json()).then(data => {
//   const roleData = data.data;
//   const roles = {};
//   roleData.forEach(champData => {
//     roles[champData.id] = champData.positions.map(position => OPGG_ROLE_TO_GAMEROLE(position.name));
//   });
//   console.log('Writing champion position data...')
//   fs.writeFileSync(`${dataPath}/role_map.json`, JSON.stringify(roles, undefined, 2));
// });

fetch("https://ddragon.leagueoflegends.com/api/versions.json").then(response => {
  response.json().then(data => {
    const version = data[0];
    const champ_url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
    console.log("Version: " + version);
    fetch(champ_url).then(response2 => {
      response2.json().then(async champData => {
        console.log("Saving champion data...");
        fs.writeFileSync(`${dataPath}/champions.json`, JSON.stringify(champData, undefined, 2));
        let newData = {};
        for (let key in champData["data"]) {
          newData[champData["data"][key]["key"]] = key
          let champId = champData["data"][key]["key"]
          if(!fs.existsSync(`${imagePath}/champions/icons/${key}_0.png`)) {
            let res = await fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${key}.png`);
            const dest = fs.createWriteStream(`${imagePath}/champions/icons/${champId}_0.png`);
            res.body.pipe(dest);
          }
          if(!fs.existsSync(`${imagePath}/champions/profile/${key}_0.jpg`)) {
            let res = await fetch(`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${key}_0.jpg`);
            const dest = fs.createWriteStream(`${imagePath}/champions/profile/${champId}_0.jpg`);
            res.body.pipe(dest);
          }
          if(!fs.existsSync(`${imagePath}/champions/splash/${champId}_0.jpg`)) {
            let res = await fetch(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${key}_0.jpg`);
            const dest = fs.createWriteStream(`${imagePath}/champions/splash/${champId}_0.jpg`);
            res.body.pipe(dest);
          }
        }
        fs.writeFileSync(`${dataPath}/champions_map.json`, JSON.stringify(newData, undefined, 2));
        fs.writeFileSync(`${backendDataPath}/champions_map.json`, JSON.stringify(newData, undefined, 2))
      });
    });

    const item_url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`;
    fetch(item_url).then(response3 => {
      response3.json().then(async itemData => {
        console.log('Saving item images...');
        fs.writeFileSync(`${dataPath}/items.json`, JSON.stringify(itemData, undefined, 2));

        for (let key in itemData["data"]) {
          if(!fs.existsSync(`${imagePath}/items/${key}.png`)) {
            let res = await fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${key}.png`);
            const dest = fs.createWriteStream(`${imagePath}/items/${key}.png`);
            res.body.pipe(dest);
          }
        }
      })
    });

    const summoner_url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`;
    fetch(summoner_url).then(response4 => {
      response4.json().then(async summonerData => {
        console.log('Saving summoner images...');
        fs.writeFileSync(`${dataPath}/summoner.json`, JSON.stringify(summonerData, undefined, 2));

        for (let key in summonerData["data"]) {
          if(!fs.existsSync(`${imagePath}/summoner/${key}.png`)) {
            let res = await fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${key}.png`);
            const dest = fs.createWriteStream(`${imagePath}/summoner/${summonerData["data"][key].key}.png`);
            res.body.pipe(dest);
          }
        }
      })
    })

    const runes_url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/runesReforged.json`;
    fetch(runes_url).then(response5 => {
      response5.json().then(async runeData => {
        console.log('Saving rune images...');
        fs.writeFileSync(`${dataPath}/runes.json`, JSON.stringify(runeData, undefined, 2));

        for (let style of runeData) {
          if(!fs.existsSync(`${imagePath}/runes/${style.id}.png`)) {
            let res = await fetch(`https://ddragon.leagueoflegends.com/cdn/img/${style.icon}`);
            const dest = fs.createWriteStream(`${imagePath}/runes/${style.id}.png`);
            res.body.pipe(dest);
          }
          for (let slot of style.slots) {
            for (let rune of slot.runes) {
              if(!fs.existsSync(`${imagePath}/runes/${rune.id}.png`)) {
                let res = await fetch(`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`);
                const dest = fs.createWriteStream(`${imagePath}/runes/${rune.id}.png`);
                res.body.pipe(dest);
              }
            }
          }
        }
      })
    })
  });
});
