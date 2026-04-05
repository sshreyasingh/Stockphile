function wantsJson(req) {
  const accept = req.get("accept") || "";
  return accept.includes("application/json");
}

module.exports = { wantsJson };
