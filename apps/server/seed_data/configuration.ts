import { IConfiguration } from "@repo/ui/types/configuration";
import {
  ConfigurationType,
  ConfigurationKey,
} from "@repo/ui/enums/configuration";

const configurations: Array<IConfiguration> = [
  {
    key: ConfigurationKey.GST_THRESHOLD,
    type: ConfigurationType.NUMBER,
    value: "1119",
    description: "GST threshold",
  },
  {
    key: ConfigurationKey.GST_ABOVE_THRESHOLD,
    type: ConfigurationType.NUMBER,
    value: "18",
    description: "GST percentage above threshold",
  },
  {
    key: ConfigurationKey.GST_BELOW_THRESHOLD,
    type: ConfigurationType.NUMBER,
    value: "12",
    description: "GST percentage below threshold",
  },
];

export default configurations;
