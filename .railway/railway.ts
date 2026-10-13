import { defineRailway, github, project, service, volume } from "railway/iac";

export default defineRailway(() => {
  const yesVolume = volume("yes-volume", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "iad", sizeMB: 500 });
  const yes = service("yes", {
    source: github("xrabbitx455/yes", { branch: "main", checkSuites: false }),
    healthcheck: "/api/branding",
    healthcheckTimeout: 300,
    replicas: { "iad": 1 },
    volumeMounts: { "/data": yesVolume },
  });

  return project("satisfied-optimism", {
    variables: { managed: false },
    resources: [yes, yesVolume],
  });
});
