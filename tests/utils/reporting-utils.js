exports.ReportUtil = class ReportUtil {

    constructor(page, testInfo){
        this.page = page;
        this.testInfo = testInfo;
    }
    async takeScreenshot(){
        await this.testInfo.attach("login success", {
            body: await this.page.screenshot(),
            contentType: "image/png",
          });
    }

    async attach(accessibilityScanResults, testInfo) {
        await testInfo.attach('accessibility-scan-results', {
            body: JSON.stringify(accessibilityScanResults, null, 2),
            contentType: 'application/json'
          });
    }
};