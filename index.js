const Discord = require("discord.js");

var request = require('request');

const YTDL = require("ytdl-core");

const fs = require("fs");

const ms = require("ms");

const PREFIX = "!";

const fortnite = require('fortnite');

var bot = new Discord.Client();

const ft = new fortnite(process.env.apikey);

let xp = require("./xp.json");

  bot .on("guildMemberAdd",function(member)
{
        member.guild.channels.find("name","👋hello_bye👋").sendMessage("היי"+" "+member.toString()+" "+"ברוך הבא למשפחת השודדים");
         var RoleBandIT = member.guild.roles.find("name", "💂🏻THE BANDITS💂🏻");
         member.addRole(RoleBandIT);
});
  bot .on("guildMemberRemove",function(member)
  {
    member.guild.channels.find("name","👋hello_bye👋").sendMessage("ביי"+" "+member.toString()+" "+"אתה לא שודד אמיתי יותר...");
  });
bot.on("ready", function(){
    console.log("Ready");
    bot.user.setGame("Sub To BandIT !");
});
function play(connection, message){
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if(server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}
var servers = {};
bot.on("message", function(message){
     if(message.author.equals(bot.user)) return;
     let xpAdd = Math.floor(Math.random() * 7) + 8;
 console.log(xpAdd);

 if(!xp[message.author.id]){
   xp[message.author.id] = {
     xp: 0,
     level: 1
   };
 }


 let curxp = xp[message.author.id].xp;
 let curlvl = xp[message.author.id].level;
 let nxtLvl = xp[message.author.id].level * 300;
 xp[message.author.id].xp =  curxp + xpAdd;
 if(nxtLvl <= xp[message.author.id].xp){
   xp[message.author.id].level = curlvl + 1;
   let lvlup = new Discord.RichEmbed()
   .setTitle("עלית רמה !")
   .setColor("#0c57d1")
   .addField("הרמה שלך עכשיו היא :", curlvl + 1);

   message.channel.send(lvlup);
 }
 fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
   if(err) console.log(err)
 });



        var args = message.content.substring(PREFIX.length).split(" ");
        switch (args[0].toLowerCase())
          {
              case "play":
              if(!args[1])
              {
                message.channel.sendMessage("בבקשה תצרף קישור לשיר שאתה רוצה לנגן");
              }
              if(!message.member.voiceChannel)
              {
                message.channel.sendMessage("אתה צריך להיות בחדר כדי לשמוע מוזיקה !");
              }
              if (!servers[message.guild.id]) servers[message.guild.id] ={
                queue: []
              }

              var server = servers[message.guild.id];
              server.queue.push(args[1]);
              if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection)
              {
                play(connection,message);
              });
                break;
                case "skip":
                    var server = servers[message.guild.id];
                    if(server.dispatcher) server.dispatcher.end();
                  break;
                  case "stop":
                    var server = servers[message.guild.id];
                    if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
                    break;
                    case "clear":
                      if(!message.member.hasPermissions("MANAGE_MESSAGES")) return message.reply("אין לך הרשאות לפקודה זאת");
                      if(!args[1]) return message.channel.sendMessage("אנא רשום כמה הודעות אתה רוצה למחוק !");
                      var amount = args[1];

                      message.channel.bulkDelete(amount).then(() =>
                      {
                        message.channel.sendMessage("מחקתי"+" "+amount+" "+"הודעות").then(message => message.delete(5000));
                      });
                      break;
                      case "say":
                          var text = args.join(" ");
                          var lol = text.replace("say ", "");
                          message.channel.sendMessage(lol);
                        break;
                        case "ftn":
                        var username = args[1];
                        if(!args[1]) message.channel.sendMessage("לא ציינת את השם של השחקן.");
                        if(console.error)
                        {
                          var er = console.error();
                          console.log(er);
                        }
                          let data = ft.getInfo(username,"pc").then(data =>
                            {
                              var stats = data.lifetimeStats;
                              var kills = stats.find(s => s.stat == "kills");
                              var wins = stats.find(s => s.stat == "wins");
                              var kd = stats.find(s => s.stat == "kd");
                              var mPlayed = stats.find(s => s.stat == "matchesPlayed");



                              var embed = new Discord.RichEmbed()
                              .setTitle("Lifetime stats")
                              .setAuthor(data.username)
                              .setColor("#0a68ff")
                              .addField("Kills",kills.value , true)
                              .addField("wins",wins.value , true)
                              .addField("KD",kd.value , true)
                              .addField("matches Played",mPlayed.value , true)
                              message.channel.send(embed);
                            })
                          break;
                          case "rank":
                              if(!xp[message.author.id]){
                              xp[message.author.id] = {
                               xp: 0,
                               level: 1
                              };
                              }
                              let curxp = xp[message.author.id].xp;
                              let curlvl = xp[message.author.id].level;
                              let nxtLvlXp = curlvl * 300;
                              let difference = nxtLvlXp - curxp;

                              let lvlEmbed = new Discord.RichEmbed()
                              .setAuthor(message.author.username)
                              .setColor("#0c57d1")
                              .addField("Level", curlvl, true)
                              .addField("XP", curxp, true)
                              .setFooter(`${difference} נקודות עד לרמה הבאה`, message.author.displayAvatarURL);

                              message.channel.send(lvlEmbed);
                            break;
                            case "muted":
                            if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("אין לך הרשאות לפקודה זאת");
                            if(args[1] == "help"){
                            message.reply("Usage: !tempmute <user> <1s/m/h/d>");
                            return;
                            }
                            let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
                            if(!tomute) return message.reply("לא מצאתי משתמש");
                            if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
                            let reason = args.slice(3).join(" ");
                            if(!reason) return message.reply("אנא רשום סיבה");

                            let muterole = message.guild.roles.find(`name`, "muted");
                            //start of create role
                            if(!muterole){
                            try{
                              muterole =  message.guild.createRole({
                                name: "muted",
                                color: "#000000",
                                permissions:[]
                              })
                              message.guild.channels.forEach((channel, id) => {
                                 channel.overwritePermissions(muterole, {
                                  SEND_MESSAGES: false,
                                  ADD_REACTIONS: false
                                });
                              });
                            }catch(e){
                              console.log(e.stack);
                            }
                            }
                            //end of create role
                            let mutetime = args[2];
                            if(!mutetime) return message.reply("אנא רשום זמן להשתק");



                            try{
                             tomute.send(`הורחקת מהצאט ל: ${mutetime}.`)
                            }catch(e){
                            message.channel.send(`המשתמש הורחק אבל השיחות הפרטיות שלו נעולות המשתש יורחק למשך :${mutetime}`)
                            }

                            let muteembed = new Discord.RichEmbed()
                            .setDescription(`Mute executed by ${message.author}`)
                            .setColor("ff0787#")
                            .addField("המשתמש המורחק :", tomute)
                            .addField("החדר בוא הושתק המשתמש :", message.channel)
                            .addField("הזמן בה ההודעה נשלחה", message.createdAt)
                            .addField("לכמה זמן מושתק המשתמש", mutetime)
                            .addField("סיבה", reason);

                            let incidentschannel = message.guild.channels.find(`name`, "logs");

                            incidentschannel.send(muteembed);
                            let thebandits = message.guild.roles.find(`name`, "💂🏻THE BANDITS💂🏻");
                            tomute.removeRole(thebandits.id);
                            tomute.addRole(muterole.id);

                            setTimeout(function(){
                            tomute.removeRole(muterole.id);
                            tomute.addRole(thebandits.id);
                            message.channel.send(`<@${tomute.id}> כבר לא בהשתק`);
                            }, ms(mutetime));
                              break;
          }
        });
bot.login(process.env.TOKEN);
