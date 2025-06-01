import { Options } from 'got';
import { XSCommonGenerator } from './generator.js';
import { RednoteCookieSession } from '@/auth/session.js';

describe(XSCommonGenerator, () => {
  const a1 = '1972697fa3d2ly0o5nfy1iqg0ra0w56q79gz2gm0450000417121';
  const b1 =
    'I38rHdgsjopgIvesdVwgIC+oIELmBZ5e3VwXLgFTIxS3bqwErFeexd0ekncAzMFYnqthIhJeSBMDKutRI3KsYorWHPtGrbV0P9WfIi/eWc6eYqtyQApPI37ekmR6QL+5Ii6sdneeSfqYHqwl2qt5B0DBIx+PGDi/sVtkIxdsxuwr4qtiIhuaIE3e3LV0I3VTIC7e0utl2ADmsLveDSKsSPw5IEvsiVtJOqw8BuwfPpdeTFWOIx4TIiu6ZPwrPut5IvlaLbgs3qtxIxes1VwHIkumIkIyejgsY/WTge7eSqte/D7sDcpipedeYrDtIC6eDVw2IENsSqtlnlSuNjVtIx5e1qt3bmAeVn8LIESLIEk8+9DUIvzy4I8OIic7ZPwFIviR4o/sDLds6PwVIC7eSd7sf0k4IEve6WGMtVwUIids3s/sxZNeiVtbcUeeYVwRIvM/z06eSuwvgf7sSqweIxltIxZSouwOgVwpsoTHPW5ef7NekuwcIEosSgoe1LuMIiNeWL0sxdh5IiJsxPw9IhR9JPwJPutWIv3e1Vt1IiNs1qw5IEKsdVtFtuw4sqwFIvhvIxqzGniRKWoexVtUIhW4Ii0edqwpBlb2peJsWU4TIiGb4PtOsqwEIvNexutd+pdeVYdsVDEbIhos3odskqt8pqwQIvNeSPwvIieeT/ubIveeSBveDPtXIx0sVqw64B8qIkWJIvvsxFOekaKsDYeeSqwoIkpgIEpYzPwqIxGSIE7eirqSwnvs0VtZIhpBbut14lNedM0eYPwpmPwZIC+7IiGy/VwttVtaIC5e0pesVPwFJqwBIhW=';
  let session: RednoteCookieSession;
  let generator: XSCommonGenerator;

  beforeEach(() => {
    session = new RednoteCookieSession();
    session.set('a1', a1);
    session.set('b1', b1, { to: 'local' });
    session.set('b1b1', '1', { to: 'local' });
    session.set('sc', '10', { to: 'session' });

    generator = new XSCommonGenerator(session, ['/api/sns/web']);
  });

  describe(XSCommonGenerator.prototype.generate, () => {
    it('should generate X-S-Common', () => {
      const req = new Options('https://edith.xiaohongshu.com/api/sns/web/v1/resource');
      const result = generator.generate('Mac OS', req);

      expect(result).toMatchSnapshot();
    });
  });
});
