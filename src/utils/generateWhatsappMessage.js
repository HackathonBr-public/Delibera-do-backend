const requestAPI = require('request');
const connection = require('../database/connection');
const appointmentController = require('../controllers/appointmentController');

module.exports = {
  async greetingSheduleAppointment(id) {

    const user = await connection('list').innerJoin('user', function() {
      this.on('list.phone_number', '=', 'users.phone').andOn('list.number_appointment', '=', id);
    })
    .innerJoin('appointment', function() {      
      this.on('list.number_appointment', '=', 'appointment.id');
    })
    .select('list.phone_number, list.name,appointment.title,appointment.link,appointment.date');

    user.map(u =>  {
      const formData = {
        from: "ahead-charger",
        to: u.phone_number, 
        contents: [{ "type": "text", 
        "text": 
        `Olá ${u.name}, você está recebendo o link para participar do ${u.title}. Visite https://delibera.do/${u.link} e utilize o seu código pessoal ${id}
        Entre neste link até o dia ${u.date}, para validar sua participação.`
  
      }]
      }
      return requestAPI.post({
        headers: {
          'Content-Type': 'application/json',
          'X-API-TOKEN': 'iDlYjUYJ02xJ7yoxrjIAFd5yn0WzaDpTFRpt'
        },
        url: 'https://api.zenvia.com/v1/channels/whatsapp/messages',
        body: JSON.stringify(formData),
      });
    })
    return res.json({message: 'Realizado, com sucesso!'});
  },

async greetingPoll(id) {

  const user = await connection('list').innerJoin('user', function() {
    this.on('list.phone_number', '=', 'users.phone').andOn('list.number_appointment', '=', id);
  })
  .innerJoin('appointment', function() {      
    this.on('list.number_appointment', '=', 'appointment.id');
  })
  .select('list.phone_number,user.name,appointment.title,appointment.link,appointment.date,appointment.description');

  user.map(u =>  {
    const formData = {
      from: "ahead-charger",
      to: u.phone_number, 
      contents: [{ "type": "text", 
      "text": 
      `Olá ${u.name}, pedimos o seu voto sobre a Assembléia - ${u.title}, referindo-se sobre "${u.description}". 
       Para isso! Basta responder por aqui o que acha sobre o assunto 
       1 - Concorda com a Pauta
       2 - Discorda com a Pauta `
    }]
    }
    return requestAPI.post({
      headers: {
        'Content-Type': 'application/json',
        'X-API-TOKEN': 'iDlYjUYJ02xJ7yoxrjIAFd5yn0WzaDpTFRpt'
      },
      url: 'https://api.zenvia.com/v1/channels/whatsapp/messages',
      body: JSON.stringify(formData),
    });
  })
  return res.json({message: 'Realizado, com sucesso!'});
},

}