export class DataPoint {
  name: string;
  value: string;
  description?: string;
}

export const imageDirectory = {
  "House Need": "public/images/axis-icons/sdg-11.1.1.png",
  Transit: "public/images/axis-icons/sdg-11.2.1.png",
  Consumption: "public/images/axis-icons/sdg-11.3.1.png",
  Civility: "public/images/axis-icons/sdg-11.3.2.png",
  Affected: "public/images/axis-icons/sdg-11.5.1.1.png",
  Disaster: "public/images/axis-icons/sdg-11.5.1.2.png",
  "Econ Loss1": "public/images/axis-icons/sdg-11.5.2.png",
  "Econ Loss2": "public/images/axis-icons/sdg-11.5.2.png",
  Waste: "public/images/axis-icons/sdg-11.6.1.png",
  PM: "public/images/axis-icons/sdg-11.6.2.png",
  // TODO: Add 11.7.1
  Assult: "public/images/axis-icons/sdg-11.7.2.png",
};

export class DataModel {
  name: string;
  data: DataPoint[];
}

export class Data {
	/** Return the max value of all DataModel.DataPoint.values */
	static getAbsoluteMax(data: DataModel[]): number {
		const nonFlatArrOfNumbers = data.map(d => 
			d.data.map(x => 
				Number(x.value)
			)
		)
		return Math.max(...this.flat(nonFlatArrOfNumbers))
	}

	private static flat(nestedArray: number[][]): number[] {
		return [].concat.apply([], nestedArray)
	}

  static getSyncData(): DataModel[] {
    return [
      {
        name: "St. John's",
        data: [
          {
            name: "PM",
            value: "1.196",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
          },
          {
            name: "Consumption",
            value: "0.549820379",
            description:
              "|Ratio of land consumption rate to population growth rate (1971 to 2011)",
          },
        ],
      },
    ];
  }
}
