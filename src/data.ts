export class DataPoint {
  name: string;
  value: string;
  description?: string;
  nonNormalValue?: string;
}

export const imageDirectory = {
  "House Need": "public/images/axis-icons/sdg-11.1.1.png",
  Transit: "public/images/axis-icons/sdg-11.2.1.png",
  Consumption: "public/images/axis-icons/sdg-11.3.1.png",
  Civility: "public/images/axis-icons/sdg-11.3.2.png",
  Affected: "public/images/axis-icons/sdg-11.7.1.png",
  Disaster: "public/images/axis-icons/sdg-11.5.1.2.png",
  Heritage: "public/images/axis-icons/sdg-11.4.1.png",
  "Econ Loss2": "public/images/axis-icons/sdg-11.5.2.png",
  Waste: "public/images/axis-icons/sdg-11.6.1.png",
  PM: "public/images/axis-icons/sdg-11.6.2.png",
  // TODO: Add 11.7.1
  Assault: "public/images/axis-icons/sdg-11.7.2.png",
};

export class DataModel {
  name: string;
  data: DataPoint[];
}

export class Data {
  /** Return the max value of all DataModel.DataPoint.values */
  static getAbsoluteMax(data: DataModel[]): number {
    const nonFlatArrOfNumbers = data.map((d) =>
      d.data.map((x) => Number(x.value))
    );
    return Math.max(...this.flat(nonFlatArrOfNumbers));
  }

  private static flat(nestedArray: number[][]): number[] {
    return [].concat.apply([], nestedArray);
  }

  /** Given a DataModel[], get the max value of every common data.name variable */
  static getMaxPerVariable(data: DataModel[]): number[] {
    return this.runOperationOnGroupOfVariables(data, Math.max);
  }

  /** Given a DataModel[], get the min value of every common data.name variable */
  static getMinPerVariable(data: DataModel[]): number[] {
    return this.runOperationOnGroupOfVariables(data, Math.min);
  }

  private static runOperationOnGroupOfVariables(data: DataModel[], operation) {
    const numberMatrix = data.map((d) => d.data.map((x) => Number(x.value)));
    let maxOfVariable: number[] = [];
    for (let i in numberMatrix[0]) {
      let groupValuesByVariable = numberMatrix.map((d) => d[i]);
      maxOfVariable.push(operation(...groupValuesByVariable));
    }
    return maxOfVariable;
  }

  /**
   * @returns   Returns all geographic data as an array of Data Model.
   * \details   Each DataModel element pertains to one city, and has a name and data property.
   *              - The data property is an array of DataPoint
   *              - Each DataPoint has three strings (name, desc, value) for the bar plot.
   */
  static getSyncData(): DataModel[] {
    return [
      {
        name: "St. John's",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.196",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.41912307",
            nonNormalValue: "2.8",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.59430496",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.397905759",
            nonNormalValue: "11.5%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.158003141",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.735469986",
            nonNormalValue: "39,627",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0",
            nonNormalValue: "$893",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.974706398",
            nonNormalValue: "$43,180,205",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0",
            nonNormalValue: "59.9",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.583333333",
            nonNormalValue: "3.75",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Halifax",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.2",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.401851333",
            nonNormalValue: "2.9",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.282722513",
            nonNormalValue: "13.7%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "1.425506519",
            nonNormalValue: "",
          },

          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0",
            nonNormalValue: "149,801",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.27556745",
            nonNormalValue: "$1,060",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.990115769",
            nonNormalValue: "$16,873,956",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.274314214",
            nonNormalValue: "70.9",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.583333333",
            nonNormalValue: "3.75",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Quebec City",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.072",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.555142299",
            nonNormalValue: "2.4",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.650214329",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.623036649",
            nonNormalValue: "7.2%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.007207309",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.678591369",
            nonNormalValue: "48,147",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.15587496",
            nonNormalValue: "$988",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.990840169",
            nonNormalValue: "$15,637,289",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.578553616",
            nonNormalValue: "83.1",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.416666667",
            nonNormalValue: "3.25",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Sherbrooke",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.2",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.20953882",
            nonNormalValue: "3.5",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.543539498",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.623036649",
            nonNormalValue: "7.2%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.2619344",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.567493002",
            nonNormalValue: "64,790",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.38804851",
            nonNormalValue: "$1,129",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.997588007",
            nonNormalValue: "$4,117,656",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.411471322",
            nonNormalValue: "76.4",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0",
            nonNormalValue: "2",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Montreal",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.116",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.542826593",
            nonNormalValue: "2.4",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.610838947",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.429319372",
            nonNormalValue: "10.9%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.351016591",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.667494914",
            nonNormalValue: "49,810",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.145046924",
            nonNormalValue: "$981",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.952931592",
            nonNormalValue: "$80,353,265",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.790523691",
            nonNormalValue: "91.6",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.416666667",
            nonNormalValue: "3.25",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Toronto",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.12",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.973481553",
            nonNormalValue: "1.1",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.63496632",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0",
            nonNormalValue: "19.1%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.463506154",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.724149925",
            nonNormalValue: "41,323",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.209202403",
            nonNormalValue: "$1,020",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.35264643",
            nonNormalValue: "$1,105,135,591",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.825436409",
            nonNormalValue: "93",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.75",
            nonNormalValue: "4.25",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Hamilton",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.088",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.597523622",
            nonNormalValue: "2.2",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.481322719",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.319371728",
            nonNormalValue: "13.0%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.389477438",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.809926691",
            nonNormalValue: "28,473",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.226784553",
            nonNormalValue: "$1,031",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.991023047",
            nonNormalValue: "$15,325,088",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.528678304",
            nonNormalValue: "81.1",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.916666667",
            nonNormalValue: "4.75",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "St. Catharines, Niagara",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.124",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.003333298",
            nonNormalValue: "4.1",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.536007348",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.272251309",
            nonNormalValue: "13.9%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.559131955",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.811198662",
            nonNormalValue: "28,283",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.047672447",
            nonNormalValue: "$922",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.99515785",
            nonNormalValue: "$8,266,321",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.523690773",
            nonNormalValue: "80.9",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.5",
            nonNormalValue: "3.5",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Kitchener, Cambridge, Waterloo",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.108",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.920192018",
            nonNormalValue: "1.2",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.480832823",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.403141361",
            nonNormalValue: "11.4%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.300360055",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.808982728",
            nonNormalValue: "28,615",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.066812117",
            nonNormalValue: "$934",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.993778421",
            nonNormalValue: "$10,621,226",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.655860349",
            nonNormalValue: "86.2",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
            nonNormalValue: "4",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "London",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.128",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.647486682",
            nonNormalValue: "2.1",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.499755052",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.272251309",
            nonNormalValue: "13.9%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.332143299",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.810418937",
            nonNormalValue: "28,399",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.22963834",
            nonNormalValue: "$1,033",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.994104631",
            nonNormalValue: "$10,064,333",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.443890274",
            nonNormalValue: "77.7",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
            nonNormalValue: "4",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Windsor",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.068",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.041724498",
            nonNormalValue: "4.0",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.593815064",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.387434555",
            nonNormalValue: "11.7%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.760131164",
            nonNormalValue: "35,933",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.319730698",
            nonNormalValue: "$1,087",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.996009291",
            nonNormalValue: "$6,812,775",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.179551122",
            nonNormalValue: "67.1",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.416666667",
            nonNormalValue: "3.25",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Winnipeg",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.168",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.653474212",
            nonNormalValue: "2.1",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.392651562",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.366492147",
            nonNormalValue: "12.1%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.104394005",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.97091365",
            nonNormalValue: "4,357",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.276811915",
            nonNormalValue: "$1,061",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.538371893",
            nonNormalValue: "$788,072,661",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.705735661",
            nonNormalValue: "88.2",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
            nonNormalValue: "4",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Regina",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.076",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.600212968",
            nonNormalValue: "2.2",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.483343539",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.303664921",
            nonNormalValue: "13.3%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.60846421",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.954228525",
            nonNormalValue: "6,857",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.340729319",
            nonNormalValue: "$1,100",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.967789841",
            nonNormalValue: "$54,987,869",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.760598504",
            nonNormalValue: "90.4",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.083333333",
            nonNormalValue: "2.25",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Saskatoon",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.128",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.728664635",
            nonNormalValue: "1.8",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.373116963",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.382198953",
            nonNormalValue: "11.8%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.033952621",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.998379091",
            nonNormalValue: "243",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.286369616",
            nonNormalValue: "$1,067",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.957170803",
            nonNormalValue: "$73,116,256",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.566084788",
            nonNormalValue: "82.6",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.583333333",
            nonNormalValue: "3.75",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Calgary",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.192",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "1.037835577",
            nonNormalValue: "0.9",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.566564605",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.408376963",
            nonNormalValue: "11.3%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.483131323",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.961429024",
            nonNormalValue: "5,778",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.624227317",
            nonNormalValue: "$1,272",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0",
            nonNormalValue: "$1,707,159,182",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.72319202",
            nonNormalValue: "88.9",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
            nonNormalValue: "4",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Edmonton",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.144",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.842841747",
            nonNormalValue: "1.5",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.475995101",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.356020942",
            nonNormalValue: "12.3%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.3266746",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.999015336",
            nonNormalValue: "148",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.64384356",
            nonNormalValue: "$1,284",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.994536848",
            nonNormalValue: "$9,326,471",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.568578554",
            nonNormalValue: "82.7",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.416666667",
            nonNormalValue: "3.25",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Vancouver",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.22",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "1.023418723",
            nonNormalValue: "0.9",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.679853031",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.078534031",
            nonNormalValue: "17.6%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.330980265",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.630853372",
            nonNormalValue: "55,298",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.405696012",
            nonNormalValue: "$1,139",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.800183756",
            nonNormalValue: "$341,118,136",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.817955112",
            nonNormalValue: "92.7",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
            nonNormalValue: "4",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
      {
        name: "Victoria",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.228",
            nonNormalValue: "",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.929264945",
            nonNormalValue: "1.2",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.563563993",
            nonNormalValue: "",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.256544503",
            nonNormalValue: "14.2%",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.041723805",
            nonNormalValue: "",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.851679244",
            nonNormalValue: "22,219",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.415613018",
            nonNormalValue: "$1,145",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.984893508",
            nonNormalValue: "$25,789,187",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.760598504",
            nonNormalValue: "90.4",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
            nonNormalValue: "4",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
            nonNormalValue: "100%",
          },
        ],
      },
    ];
  }
}
