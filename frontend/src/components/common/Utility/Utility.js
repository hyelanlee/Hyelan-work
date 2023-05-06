import { CodeHelper } from '@components/common/Utility/CodeHelper';
import { Common } from '@components/common/Utility/Common';
import { Grid } from '@components/common/Utility/Grid';
import { Command } from '@components/common/Utility/Command';
import { Report } from '@components/common/Utility/Report';

export class Utility {
  /**
   * [유틸리티 생성자]
   * @param {*프로그램 ID} pgmid
   * @param {*alert} setalert
   * @param {*CodeHelper 사용여부} isCodeHelper
   * @param {*Comnad 사용여부} isCommand
   * @param {*Common 사용여부} isCommon
   * @param {*Grid 사용여부} isGrid
   * @param {*Report 사용여부} isReport
   */
  constructor(pgmid, setalert, isCodeHelper, isCommand, isCommon, isGrid, isReport) {
    if (isCodeHelper) {
      this.CodeHelper = new CodeHelper();
    }
    if (isCommand) {
      this.Command = new Command(setalert);
    }
    if (isCommon) {
      this.Common = new Common(pgmid, setalert);
    }
    if (isGrid) {
      this.Grid = new Grid(setalert);
    }
    if (isReport) {
      this.Report = new Report();
    }
  }
}

export default Utility;
