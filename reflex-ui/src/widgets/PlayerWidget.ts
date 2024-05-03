import { SpriteManager, Widget, animateLayout, setLayout, timingAnim } from '@bhoos/game-kit-ui';
import { ProfileSprite, ProfileSpriteProfile } from '../sprites';

type State = {
  profile: ProfileSpriteProfile;
  isWinner: boolean;
};

type Layout = {
  x: number;
  y: number;
};

export class PlayerWidget extends Widget<Layout, State, SpriteManager> {
  profileSprite: ProfileSprite;
  constructor(s: SpriteManager, computeLayout: () => Layout, computeState: () => State) {
    super(s, computeLayout, computeState);
    this.profileSprite = s.registerSprite(new ProfileSprite());
    this.onLayoutUpdate();
  }

  protected onLayoutUpdate(): void {
    setLayout(this.profileSprite, this.layout);
  }

  protected onDraw() {
    const state = this.state;
    this.profileSprite.opacity.setValue(1);
    if (state.isWinner) {
      this.profileSprite.profile.setValue({
        ...state.profile,
        name: 'Winner',
      });
    } else {
      this.profileSprite.profile.setValue(state.profile);
    }
    setLayout(this.profileSprite, this.layout);
  }
}
