import { FunctionComponent } from "preact";
import { ComponentMutator, SNComponent } from "@standardnotes/snjs";

import { PreferencesSegment, Subtitle, Title, Text } from "@/preferences/components";
import { Switch } from "@/components/Switch";
import { WebApplication } from "@/ui_models/application";
import { useState } from "preact/hooks";

const ExtensionVersions: FunctionComponent<{ extension: SNComponent }> = ({ extension }) => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col flex-grow">
        <Text>Installed version</Text>
        <Text>{extension.package_info.version}</Text>
      </div>
      <div className="flex flex-col flex-grow">
        <Text>Latest version</Text>
        <Text>le version</Text>
      </div>
    </div>
  );
};

const AutoUpdateLocal: FunctionComponent<{
  autoupdateDisabled: boolean,
  toggleAutoupdate: () => void
}> = ({ autoupdateDisabled, toggleAutoupdate }) => (
  <div className="flex flex-row">
    <Subtitle className="flex-grow">Autoupdate local installation</Subtitle>
    <Switch onChange={toggleAutoupdate} checked={!autoupdateDisabled} />
  </div>
);

const UseHosted: FunctionComponent<{
  offlineOnly: boolean, toggleOfllineOnly: () => void
}> = ({ offlineOnly, toggleOfllineOnly }) => (
  <div className="flex flex-row">
    <Subtitle className="flex-grow">Use hosted when local is unavailable</Subtitle>
    <Switch onChange={toggleOfllineOnly} checked={!offlineOnly} />
  </div>
);

export const ExtensionItem: FunctionComponent<{
  application: WebApplication, extension: SNComponent, first: boolean
}> = ({ application, extension, first }) => {
  const [autoupdateDisabled, setAutoupdateDisabled] = useState(extension.autoupdateDisabled ?? false);
  const [offlineOnly, setOfflineOnly] = useState(extension.offlineOnly ?? false);

  const toggleAutoupdate = () => {
    application
      .changeAndSaveItem(extension.uuid, (m: ComponentMutator) => {
        if (m.typedContent == undefined) (m as any).typedContent = {};
        m.typedContent.autoupdateDisabled = !autoupdateDisabled;
      })
      .then((item) => {
        const component = (item as SNComponent);
        setAutoupdateDisabled(component.autoupdateDisabled);
      })
      .catch(e => {
        console.error(e);
      });

  };

  const toggleOfllineOnly = () => {
    application
      .changeAndSaveItem(extension.uuid, (m: ComponentMutator) => {
        if (m.typedContent == undefined) (m as any).typedContent = {};
        m.typedContent.offlineOnly = !offlineOnly;
      })
      .then((item) => {
        const component = (item as SNComponent);
        setOfflineOnly(component.offlineOnly);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const localInstallable = extension.package_info.download_url;
  return (
    <PreferencesSegment>
      {first && <>
        <Title>Extensions</Title>
        <div className="w-full min-h-3" />
      </>}
      <Subtitle>{extension.name}</Subtitle>
      <ExtensionVersions extension={extension} />
      {localInstallable ? <AutoUpdateLocal autoupdateDisabled={autoupdateDisabled} toggleAutoupdate={toggleAutoupdate} /> : null}
      {localInstallable ? <UseHosted offlineOnly={offlineOnly} toggleOfllineOnly={toggleOfllineOnly} /> : null}
    </PreferencesSegment>
  );
};
