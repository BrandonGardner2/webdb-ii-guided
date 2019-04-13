const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./database/roles.db3"
  }
};

const db = knex(knexConfig);

router.get("/", async (req, res) => {
  // get the roles from the database
  try {
    const roles = await db("roles");
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  // retrieve a role by id
  const { id } = req.params;
  try {
    const role = await db("roles")
      .where({ id })
      .first();
    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ message: "There is no role with that id." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  const role = req.body;
  try {
    const [id] = await db("roles").insert(role);
    const newRole = await db("roles")
      .where({ id })
      .first();
    res.status(201).json(newRole);
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error inserting the role(s)." });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  try {
    const count = await db("roles")
      .where({ id })
      .update(newInfo);
    if (count) {
      const updated = await db("roles")
        .where({ id })
        .first();
      res.status(200).json(updated);
    } else {
      res.status(404).json({ message: "The record could not be located" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const count = await db("roles")
      .where({ id })
      .del();
    if (count) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "The record could not be located." });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
