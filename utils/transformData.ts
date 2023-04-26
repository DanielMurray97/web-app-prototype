import JournalDatapoint from '../types/JournalDataPoint';
import MacroDataPoint from '../types/MacroDataPoint';

export default function transformData(postgres_data: JournalDatapoint[]) {

    const transformed_data: MacroDataPoint[][] = [];
    postgres_data.forEach((element: JournalDatapoint) => {
      const inner_arr: MacroDataPoint[] = [
        { text: element.journal_entry_id },
        { text: element.full_name },
        { text: element.title },
        { text: element.journal_entry },
      ];
      transformed_data.push(inner_arr);
    });
  
    return transformed_data;
  }