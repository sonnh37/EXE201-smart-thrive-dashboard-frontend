import { Provider } from "./provider";
import { BaseEntity } from "./base";

export interface Address extends BaseEntity {
  providerId?: string;
  city?: string;
  district?: string; 
  town?: string;    
  street?: string;   
  buildingNumber?: string;
  provider?: Provider;
}
