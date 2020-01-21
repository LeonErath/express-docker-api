const express = require("express");
const fetch = require("node-fetch");
const Docker = require("dockerode");
const app = express();
var cors = require("cors");

app.use(cors());

const port = 3002;

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

app.get("/api/docker/containers", (req, res) => {
	docker.listContainers({ all: true }, (err, containers) => {
		if (err) res.send({ error: err.message });
		console.log("ALL: " + containers.length);
		res.send(containers);
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
