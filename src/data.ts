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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.41912307",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.59430496",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.397905759",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.158003141",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.735469986",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.974706398",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.583333333",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.401851333",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.282722513",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "1.425506519",
          },

          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.27556745",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.990115769",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.274314214",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.583333333",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.555142299",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.650214329",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.623036649",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.007207309",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.678591369",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.15587496",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.990840169",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.578553616",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.416666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.20953882",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.543539498",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.623036649",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.2619344",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.567493002",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.38804851",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.997588007",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.411471322",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.542826593",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.610838947",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.429319372",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.351016591",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.667494914",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.145046924",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.952931592",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.790523691",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.416666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.973481553",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.63496632",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.463506154",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.724149925",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.209202403",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.35264643",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.825436409",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.75",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.597523622",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.481322719",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.319371728",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.389477438",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.809926691",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.226784553",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.991023047",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.528678304",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.916666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.003333298",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.536007348",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.272251309",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.559131955",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.811198662",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.047672447",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.99515785",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.523690773",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.5",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.920192018",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.480832823",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.403141361",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.300360055",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.808982728",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.066812117",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.993778421",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.655860349",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.647486682",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.499755052",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.272251309",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.332143299",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.810418937",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.22963834",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.994104631",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.443890274",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.041724498",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.593815064",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.387434555",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.760131164",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.319730698",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.996009291",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.179551122",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.416666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.653474212",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.392651562",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.366492147",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.104394005",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.97091365",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.276811915",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.538371893",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.705735661",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.600212968",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.483343539",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.303664921",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.60846421",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.954228525",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.340729319",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.967789841",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.760598504",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.083333333",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.728664635",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.373116963",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.382198953",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.033952621",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.998379091",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.286369616",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.957170803",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.566084788",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.583333333",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "1.037835577",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.566564605",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.408376963",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.483131323",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.961429024",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.624227317",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.72319202",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.842841747",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.475995101",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.356020942",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.3266746",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.999015336",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.64384356",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.994536848",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.568578554",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.416666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "1.023418723",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.679853031",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.078534031",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.330980265",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.630853372",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.405696012",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.800183756",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.817955112",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
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
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.929264945",
          },
          {
            name: "Assault",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.563563993",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.256544503",
          },
          {
            name: "Affected",
            description:
              "Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities",
            value: "0.041723805",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.851679244",
          },
          {
            name: "Heritage",
            description:
              "Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding (public, private), type of heritage (cultural, natural) and level of government (national, regional, and local/municipal)",
            value: "0.415613018",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.984893508",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.760598504",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.666666667",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1",
          },
        ],
      },
    ];
  }
}
