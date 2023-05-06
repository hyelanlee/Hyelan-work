export class Report {
  /**
   * [레포트]
   * @param {*데이터} rData
   * @param {*레포트파일} report
   * @param {*프로세스} process
   */
  fReport = (rData, report, server, client) => {
    let viewer = new window.m2soft.crownix.Viewer(server + '/service', 'crownix-viewer');
    viewer.setRData(rData);
    viewer.openFile(client + report, '');
  };

  fReportSaveAsPdf = async (rData, report, server, client, filename) => {
    let invoker = new window.m2soft.crownix.ReportingServerInvoker(server + '/service');
    invoker.addParameter('opcode', '500');
    invoker.addParameter('mrd_path', client + report);
    invoker.addParameter('mrd_data', rData);
    invoker.addParameter('mrd_param', '/rsave');
    invoker.addParameter('export_type', 'pdf');
    invoker.addParameter('export_name', filename + '.pdf');
    invoker.addParameter('protocol', 'file');
    invoker.addParameter('attachment', 'true');
    invoker.useIframe(true);
    invoker.invoke();

    // let invoker = new window.m2soft.crownix.ReportingServerInvoker(server + '/service');
    // invoker.addParameter('opcode', '501');
    // invoker.addParameter('mrd_path', client + report);
    // invoker.addParameter('mrd_data', rData);
    // invoker.addParameter('mrd_param', '/rsave');
    // invoker.addParameter('export_type', 'pdf');
    // invoker.addParameter('export_name', filename + '.pdf');
    // invoker.addParameter('protocol', 'async');
    // invoker.addParameter('user_id', 'admin');
    // invoker.addParameter('user_pwd', 'admin');
    // invoker.addParameter('category_id', '1');
    // invoker.addParameter('service_url', 'http://localhost/Git_Server/Test.git');
    // invoker.addParameter('attachment', 'true');
    // invoker.useIframe(true);
    // invoker.invoke();
  };

  /**
   * [ArrayBuffer -> Base64로 인코딩]
   * @param {*} buffer
   * @returns
   */
  fArrayBufferToBase64 = (buffer) => {
    if (buffer === 'no') {
      return 'noImage';
    } else {
      let binary = '';
      let bytes = [].slice.call(new Uint8Array(buffer));
      bytes.forEach((b) => (binary += String.fromCharCode(b)));
      return window.btoa(binary);
    }
  };
}

export default Report;
