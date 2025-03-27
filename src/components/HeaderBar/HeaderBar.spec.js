import { mount } from '@vue/test-utils';
import Headerbar from './HeaderBar';

describe('Spec Headerbar', function() {
    it('mounts', () => {
        const wrapper = mount(Headerbar);
        expect(wrapper)
            .toBeTruthy();
    });
});
