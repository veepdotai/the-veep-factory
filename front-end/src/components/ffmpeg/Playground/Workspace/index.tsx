import { useState, useEffect, ChangeEvent, MutableRefObject } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LinearProgressWithLabel from "../../common/LinearProgressWithLabel";

import { downloadFile } from "../../util";
import { Node } from "./types";
import FileSystemManager from "./FileSystemManager";

const defaultArgs = JSON.stringify(["-i", "test.m4a", "test.mp3"], null, 2);

interface WorkspaceProps {
  ffmpeg: MutableRefObject<FFmpeg>;
}

export default function Workspace({ ffmpeg: _ffmpeg }: WorkspaceProps) {
  const [path, setPath] = useState("/");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [args, setArgs] = useState(defaultArgs);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const ffmpeg = _ffmpeg.current;

  const refreshDir = async (curPath: string) => {
    if (ffmpeg.loaded) {
      setNodes(
        (await ffmpeg.listDir(curPath)).filter(({ name }) => name !== ".")
      );
    }
  };

  const onNewNameChange = () => async (event: ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const onCloseRenameModal = () => async () => {
    setRenameOpen(false);
  };

  const onFileUpload =
    (isText: boolean) =>
    async ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let data: Uint8Array | string = await fetchFile(file);
        if (isText) data = new TextDecoder().decode(data);
        await ffmpeg.writeFile(`${path}/${file.name}`, data);
      }
      refreshDir(path);
    };

  const onFileClick = (name: string) => async (option: string) => {
    const fullPath = `${path}/${name}`;
    switch (option) {
      case "rename":
        setOldName(name);
        setNewName("");
        setRenameOpen(true);
        break;
      case "download":
        downloadFile(
          name,
          ((await ffmpeg.readFile(fullPath, "binary")) as Uint8Array).buffer
        );
        break;
      case "download-text":
        downloadFile(name, await ffmpeg.readFile(fullPath, "utf8"));
        break;
      case "delete":
        await ffmpeg.deleteFile(fullPath);
        refreshDir(path);
        break;
      default:
        break;
    }
  };

  const onDirClick = (name: string) => async () => {
    let nextPath = path;
    if (path === "/") {
      if (name !== "..") nextPath = `/${name}`;
    } else if (name === "..") {
      const cols = path.split("/");
      cols.pop();
      nextPath = cols.length === 1 ? "/" : cols.join("/");
    } else {
      nextPath = `${path}/${name}`;
    }
    setPath(nextPath);
    refreshDir(nextPath);
  };

  const onDirCreate = (name: string) => async () => {
    alert('TestFF : avant');
    if (name !== "") {
      await ffmpeg.createDir(`${path}/${name}`);
    }
    refreshDir(path);
  };

  const onRename = (old_name: string, new_name: string) => async () => {
    if (old_name !== "" && new_name !== "") {
      await ffmpeg.rename(`${path}/${old_name}`, `${path}/${new_name}`);
    }
    setRenameOpen(false);
    refreshDir(path);
  };

  const onExec = async () => {
    setProgress(0);
    setTime(0);
    const logListener = ({ message }) => {
      setLogs((_logs) => [..._logs, message]);
    };
    const progListener = ({ progress: prog }) => {
      setProgress(prog * 100);
    };
    ffmpeg.on("log", logListener);
    ffmpeg.on("progress", progListener);
    const start = performance.now();
    await ffmpeg.exec(JSON.parse(args));
    setTime(performance.now() - start);
    ffmpeg.off("log", logListener);
    ffmpeg.off("progress", progListener);
    refreshDir(path);
  };

  useEffect(() => {
    refreshDir(path);
  }, []);

  return (
    <Row>
      <Col xs={6}>
        <FileSystemManager
          path={path}
          nodes={nodes}
          oldName={oldName}
          newName={newName}
          renameOpen={renameOpen}
          onNewNameChange={onNewNameChange}
          onCloseRenameModal={onCloseRenameModal}
          onFileUpload={onFileUpload}
          onFileClick={onFileClick}
          onDirClick={onDirClick}
          onDirCreate={onDirCreate}
          onRename={onRename}
          onRefresh={() => refreshDir(path)}
        />
      </Col>
      <Col>
        <Typography>Transcoding Progress:</Typography>
        <LinearProgressWithLabel value={progress} />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Typography>
            {time === 0 ? "" : `Time Elapsed: ${(time / 1000).toFixed(2)} s`}
          </Typography>
          <Button variant="contained" onClick={onExec}>
            Run
          </Button>
        </Stack>
      </Col>
    </Row>
  );
}
