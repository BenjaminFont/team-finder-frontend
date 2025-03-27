import { mount } from '@vue/test-utils';
import Playerprofile from './PlayerProfile';

describe('Spec Playerprofile', function() {
    it('mounts', () => {
        const wrapper = mount(Playerprofile);
        expect(wrapper)
            .toBeTruthy();
    });
});
