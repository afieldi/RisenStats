
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

// Temp creating this file
fs.writeFileSync(`${dataPath}/role_map.json`, JSON.stringify("{\"1\":[\"MIDDLE\"],\"2\":[\"TOP\"],\"3\":[\"MIDDLE\",\"SUPPORT\",\"TOP\"],\"4\":[\"MIDDLE\"],\"5\":[\"JUNGLE\"],\"6\":[\"TOP\"],\"7\":[\"MIDDLE\",\"SUPPORT\"],\"8\":[\"MIDDLE\",\"TOP\"],\"9\":[\"JUNGLE\",\"SUPPORT\"],\"10\":[\"TOP\",\"MIDDLE\"],\"11\":[\"JUNGLE\"],\"12\":[\"SUPPORT\"],\"13\":[\"MIDDLE\",\"TOP\"],\"14\":[\"TOP\",\"MIDDLE\"],\"15\":[\"BOTTOM\"],\"16\":[\"SUPPORT\"],\"17\":[\"TOP\",\"JUNGLE\",\"SUPPORT\"],\"18\":[\"BOTTOM\",\"MIDDLE\"],\"19\":[\"JUNGLE\",\"TOP\"],\"20\":[\"JUNGLE\"],\"21\":[\"BOTTOM\"],\"22\":[\"BOTTOM\"],\"23\":[\"TOP\",\"MIDDLE\"],\"24\":[\"TOP\"],\"25\":[\"SUPPORT\"],\"26\":[\"SUPPORT\"],\"27\":[\"TOP\"],\"28\":[\"JUNGLE\"],\"29\":[\"BOTTOM\"],\"30\":[\"JUNGLE\",\"BOTTOM\"],\"31\":[\"TOP\",\"MIDDLE\"],\"32\":[\"JUNGLE\",\"SUPPORT\"],\"33\":[\"JUNGLE\"],\"34\":[\"MIDDLE\"],\"35\":[\"JUNGLE\",\"SUPPORT\"],\"36\":[\"TOP\",\"JUNGLE\"],\"37\":[\"SUPPORT\"],\"38\":[\"MIDDLE\"],\"39\":[\"TOP\",\"MIDDLE\"],\"40\":[\"SUPPORT\"],\"41\":[\"TOP\"],\"42\":[\"BOTTOM\",\"MIDDLE\"],\"43\":[\"SUPPORT\"],\"44\":[\"SUPPORT\"],\"45\":[\"MIDDLE\",\"BOTTOM\"],\"48\":[\"TOP\",\"JUNGLE\"],\"50\":[\"MIDDLE\",\"BOTTOM\",\"SUPPORT\",\"TOP\"],\"51\":[\"BOTTOM\"],\"53\":[\"SUPPORT\"],\"54\":[\"TOP\",\"MIDDLE\"],\"55\":[\"MIDDLE\"],\"56\":[\"JUNGLE\"],\"57\":[\"SUPPORT\",\"TOP\"],\"58\":[\"TOP\"],\"59\":[\"JUNGLE\"],\"60\":[\"JUNGLE\",\"SUPPORT\"],\"61\":[\"MIDDLE\"],\"62\":[\"JUNGLE\",\"TOP\"],\"63\":[\"SUPPORT\",\"BOTTOM\",\"MIDDLE\"],\"64\":[\"JUNGLE\"],\"67\":[\"BOTTOM\",\"TOP\"],\"68\":[\"TOP\",\"MIDDLE\"],\"69\":[\"MIDDLE\",\"TOP\",\"BOTTOM\"],\"72\":[\"JUNGLE\"],\"74\":[\"TOP\"],\"75\":[\"TOP\"],\"76\":[\"JUNGLE\"],\"77\":[\"JUNGLE\",\"TOP\"],\"78\":[\"SUPPORT\",\"TOP\",\"JUNGLE\"],\"79\":[\"TOP\",\"JUNGLE\",\"MIDDLE\"],\"80\":[\"TOP\",\"SUPPORT\",\"JUNGLE\",\"MIDDLE\"],\"81\":[\"BOTTOM\"],\"82\":[\"TOP\",\"MIDDLE\",\"JUNGLE\"],\"83\":[\"TOP\",\"JUNGLE\"],\"84\":[\"MIDDLE\",\"TOP\"],\"85\":[\"TOP\",\"MIDDLE\"],\"86\":[\"TOP\",\"MIDDLE\"],\"89\":[\"SUPPORT\"],\"90\":[\"MIDDLE\"],\"91\":[\"MIDDLE\",\"JUNGLE\"],\"92\":[\"TOP\"],\"96\":[\"BOTTOM\"],\"98\":[\"TOP\",\"SUPPORT\"],\"99\":[\"SUPPORT\",\"MIDDLE\",\"BOTTOM\"],\"101\":[\"MIDDLE\",\"SUPPORT\"],\"102\":[\"JUNGLE\"],\"103\":[\"MIDDLE\"],\"104\":[\"JUNGLE\"],\"105\":[\"MIDDLE\"],\"106\":[\"TOP\",\"JUNGLE\"],\"107\":[\"JUNGLE\"],\"110\":[\"BOTTOM\"],\"111\":[\"SUPPORT\"],\"112\":[\"MIDDLE\",\"BOTTOM\"],\"113\":[\"JUNGLE\",\"TOP\"],\"114\":[\"TOP\"],\"115\":[\"BOTTOM\",\"MIDDLE\"],\"117\":[\"SUPPORT\"],\"119\":[\"BOTTOM\"],\"120\":[\"JUNGLE\"],\"121\":[\"JUNGLE\"],\"122\":[\"TOP\"],\"126\":[\"TOP\",\"MIDDLE\"],\"127\":[\"MIDDLE\"],\"131\":[\"JUNGLE\",\"MIDDLE\"],\"133\":[\"TOP\"],\"134\":[\"MIDDLE\",\"BOTTOM\"],\"136\":[\"MIDDLE\"],\"141\":[\"JUNGLE\"],\"142\":[\"MIDDLE\",\"SUPPORT\"],\"143\":[\"SUPPORT\",\"JUNGLE\",\"BOTTOM\"],\"145\":[\"BOTTOM\"],\"147\":[\"SUPPORT\",\"BOTTOM\"],\"150\":[\"TOP\"],\"154\":[\"JUNGLE\",\"TOP\"],\"157\":[\"MIDDLE\",\"TOP\",\"BOTTOM\"],\"161\":[\"SUPPORT\",\"MIDDLE\"],\"163\":[\"MIDDLE\",\"JUNGLE\"],\"164\":[\"TOP\",\"SUPPORT\"],\"166\":[\"MIDDLE\"],\"200\":[\"JUNGLE\"],\"201\":[\"SUPPORT\"],\"202\":[\"BOTTOM\"],\"203\":[\"JUNGLE\"],\"221\":[\"BOTTOM\"],\"222\":[\"BOTTOM\"],\"223\":[\"SUPPORT\",\"TOP\"],\"233\":[\"JUNGLE\"],\"234\":[\"JUNGLE\"],\"235\":[\"SUPPORT\"],\"236\":[\"BOTTOM\"],\"238\":[\"MIDDLE\",\"JUNGLE\"],\"240\":[\"TOP\"],\"245\":[\"JUNGLE\",\"MIDDLE\"],\"246\":[\"MIDDLE\",\"JUNGLE\"],\"254\":[\"JUNGLE\"],\"266\":[\"TOP\"],\"267\":[\"SUPPORT\"],\"268\":[\"MIDDLE\"],\"350\":[\"SUPPORT\"],\"360\":[\"BOTTOM\"],\"412\":[\"SUPPORT\"],\"420\":[\"TOP\"],\"421\":[\"JUNGLE\"],\"427\":[\"JUNGLE\"],\"429\":[\"BOTTOM\"],\"432\":[\"SUPPORT\"],\"497\":[\"SUPPORT\"],\"498\":[\"BOTTOM\"],\"516\":[\"TOP\"],\"517\":[\"MIDDLE\",\"TOP\",\"SUPPORT\"],\"518\":[\"SUPPORT\",\"MIDDLE\"],\"523\":[\"BOTTOM\"],\"526\":[\"SUPPORT\"],\"555\":[\"SUPPORT\"],\"711\":[\"MIDDLE\"],\"777\":[\"MIDDLE\",\"TOP\"],\"799\":[\"TOP\",\"MIDDLE\",\"JUNGLE\"],\"875\":[\"TOP\"],\"876\":[\"JUNGLE\"],\"887\":[\"TOP\",\"JUNGLE\"],\"888\":[\"SUPPORT\"],\"893\":[\"MIDDLE\",\"TOP\"],\"895\":[\"BOTTOM\"],\"897\":[\"TOP\"],\"901\":[\"BOTTOM\",\"MIDDLE\"],\"902\":[\"SUPPORT\"],\"910\":[\"MIDDLE\",\"BOTTOM\",\"SUPPORT\"],\"950\":[\"MIDDLE\"]}", undefined, 2));


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
