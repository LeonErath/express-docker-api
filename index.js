const express = require("express");
const Docker = require("dockerode");
const helmet = require("helmet");
const app = express();
var cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

const port = 3002;

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const basePath = "/api/docker";

app.get(basePath + "/containers", async (req, res) => {
	docker.listContainers({ all: true }, (err, containers) => {
		if (err) res.send({ error: err.message });
		console.log("ALL: " + containers.length);
		res.send({ containers });
	});
});

app.get(basePath + "/containers/:id", async (req, res) => {
	const container = await docker.getContainer(req.params.id);
	res.send({ container });
});

app.post(basePath + "/containers/:id/stop", (req, res) => {
	docker
		.getContainer(req.params.id)
		.stop()
		.then(v => {
			res.send(`Stopped container with id: ${req.params.id}`);
		})
		.catch(e => {
			console.log(e);
			res.send(`Could not stop container with id: ${req.params.id}`);
		});
});

app.post(basePath + "/containers/:id/restart", (req, res) => {
	docker
		.getContainer(req.params.id)
		.restart()
		.then(v => {
			res.send(`Restarted container with id: ${req.params.id}`);
		})
		.catch(e => {
			console.log(e);
			res.send(`Could not restart container with id: ${req.params.id}`);
		});
});

app.post(basePath + "/containers/stop", (req, res) => {
	docker.listContainers({ all: true }, (err, containers) => {
		if (err) res.send({ error: err.message });
		containers.forEach(containerInfo => {
			docker.getContainer(containerInfo.Id).stop();
		});
	});
	res.send(`Stopped all containers!`);
});

app.listen(port, () =>
	console.log(`Express docker api listening on port ${port}!`)
);
