const { railwaySequelize } = require('./config/db');
const sequelize = railwaySequelize;  // now this is a Sequelize instance

const defineAbout = require('./models/aboutModel');
const defineAnnouncements = require('./models/announcementsModel');
const defineCompetition = require('./models/competitionModel');
const defineEvents = require('./models/eventsModel');
const defineFundraisers = require('./models/fundraisersModel');
const defineMaterials = require('./models/materialsModel');
const defineResources = require('./models/resourcesModel');
const defineUserCompXref = require('./models/user_comp_xrefModel');
const defineUserEventXref = require('./models/user_event_xrefModel');
const defineUserFundXref = require('./models/user_fund_xrefModel');
const defineUser = require('./models/userModel');

const About = defineAbout(sequelize);
const Announcements = defineAnnouncements(sequelize);
const Competitions = defineCompetition(sequelize);
const Events = defineEvents(sequelize);
const Fundraisers = defineFundraisers(sequelize);
const Materials = defineMaterials(sequelize);
const Resources = defineResources(sequelize);
const UserCompXref = defineUserCompXref(sequelize);
const UserEventXref = defineUserEventXref(sequelize);
const UserFundXref = defineUserFundXref(sequelize);
const User = defineUser(sequelize);

sequelize.sync({ alter: true })  // or force: true to drop and recreate
  .then(() => {
    console.log('✅ Tables synced to Railway DB!');
    process.exit(); // Exit when done
  })
  .catch((err) => {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  });