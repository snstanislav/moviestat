const mongoose = require("mongoose");

async function connect(uri) {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URI);
}

async function disconnect() {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}

module.exports = {
    connect: connect,
    disconnect: disconnect
}
