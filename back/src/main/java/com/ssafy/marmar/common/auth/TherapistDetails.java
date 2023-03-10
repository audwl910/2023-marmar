package com.ssafy.marmar.common.auth;

import com.ssafy.marmar.db.model.Therapist;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class TherapistDetails implements UserDetails {


    Therapist therapist;

    boolean accountNonExpired;
    boolean accountNonLocked;
    boolean credentialNonExpired;
    boolean enabled = false;
    List<GrantedAuthority> roles = new ArrayList<>();

    public TherapistDetails(Therapist therapist) {
        super();
        this.therapist = therapist;
    }

    public Therapist getTherapist() {
        return this.therapist;
    }
    @Override
    public String getPassword() {
        return this.therapist.getTherapistPassword();
    }
    @Override
    public String getUsername() {
        return this.therapist.getTherapistId();
    }
    @Override
    public boolean isAccountNonExpired() {
        return this.accountNonExpired;
    }
    @Override
    public boolean isAccountNonLocked() {
        return this.accountNonLocked;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return this.credentialNonExpired;
    }
    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles;
    }
    public void setAuthorities(List<GrantedAuthority> roles) {
        this.roles = roles;
    }
}
