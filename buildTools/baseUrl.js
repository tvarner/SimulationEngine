export default function getBaseUrl() {
  const inDevelopment = window.location.hostname === 'localhost';
  // Note that this baseUrl assumes you're running CarDashboard via IIS at vinconnect.com via a hosts file entry.
  // See https://github.com/cox-auto-kc/fusion-starter#initial-machine-setup for more info.
  return inDevelopment ? 'http://vinconnect.com/CarDashboard/' : '/CarDashboard/';
}
